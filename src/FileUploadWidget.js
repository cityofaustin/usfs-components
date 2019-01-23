import React, { Component } from 'react';

import { FilePond, File, registerPlugin } from 'react-filepond';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

import crypto from 'crypto';
import uuid from 'uuid';

const endpoint = process.env.API_URL;

class FileUploadWidget extends Component {
  constructor(props) {
    super(props);
      const uniqueid = crypto.createHmac('sha256', uuid.v4()).digest('hex');
      console.log("Unique Identifier: " + uniqueid);

      console.log("End-point (API_URL): " + endpoint);

      this.state = {
        uniqueIdentifier: uniqueid,
        files: [],
        fileList: [],
      };

      this.fileList = [];

      this.filesUpdated = this.filesUpdated.bind(this);
  }

  handleInit() {
    console.log('FilePond instance has initialised', this.pond);
  }

  handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
    console.log('Whoa! We are actually running a custom thing');
    // fieldName is the name of the input field
    // file is the actual file object to send
    const formData = new FormData();

    // First, find the S3 signature data from this.state.fileList

    let fileSignature = this.getFileSignatureFromList(file);
    let fields = [];

    if (fileSignature == null) {
      console.log(file);
      console.log('The file signature for file could not be located.');
    }

    console.log(fileSignature);

    try {
      fields = Object.keys(fileSignature['fields']);
      console.log('handleUpload() Object keys loaded');
    } catch (error) {
      fields = [];
      console.log("Yikes, no good: ");
      console.log(error);
    }

    for (const key of fields) {
      console.log(key + ' = ' + fileSignature['fields'][key]);
      formData.append(key, fileSignature['fields'][key]);
    }
    console.log('fieldName:' + fieldName);

    console.log('key:' + fileSignature['fields']['key']);
    formData.append('file', file, fileSignature['fields']['key']);

    const request = new XMLHttpRequest();

    request.open('POST', fileSignature['url']);

    // Should call the progress method to update the progress to 100% before calling load
    // Setting computable to false switches the loading indicator to infinite mode
    request.upload.onprogress = e => {
      progress(e.lengthComputable, e.loaded, e.total);
    };

    // Should call the load method when done and pass the returned server file id
    // this server file id is then used later on when reverting or restoring a file
    // so your server knows which file to return without exposing that info to the client
    request.onload = function() {
      if (request.status >= 200 && request.status < 300) {
        // the load method accepts either a string (id) or an object
        load(request.responseText);
      } else {
        // Can call the error method if something is wrong, should exit after
        error('oh no');
      }
    };

    request.send(formData);

    // Should expose an abort method so the request can be cancelled
    return {
      abort: () => {
        // This function is entered if the user has tapped the cancel button
        request.abort();

        // Let FilePond know the request has been cancelled
        abort();
      }
    };
  }

  withQuery(url, params) {
    let query = Object.keys(params)
      .filter(k => params[k] !== undefined)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');
    url += (url.indexOf('?') === -1 ? '?' : '&') + query;
    return url;
  }

  parseSignatureResponse(res) {
    console.log('parseSignatureResponse: ');
    console.log(res['filename']);
    console.log(res['creds']['fields'] || 'Invalid response');
    this.fileList.push(res);

    const value = this.fileList.length
      ? JSON.stringify(this.fileList.map(f => `${f.creds.fields.key}`))
      : false;

    this.props.onChange(value);

    // this.props.onChange(this.fileList);

    console.log('WE HAVE FILES UPDATED:');
    console.log(this.props.value);

    console.log(this.fileList);

    this.setState({
      fileList: [...this.fileList],
    });
  }

  retrieveFileSignature (key, uniqueIdentifier) {
    console.log("retrieveFileSignature: " + key + ", " + uniqueIdentifier);

    var formData = new FormData();

    formData.append('key', key);
    formData.append('uniqueid', uniqueIdentifier);

    fetch(this.withQuery(endpoint + "/uploads/request-signature", {
      file: key,
      uniqueid: uniqueIdentifier.toLowerCase()
    }))
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(res => {
      this.parseSignatureResponse(res);
    })
  }

  handleFileAdded(error, file) {
    console.log('handleFileAdded() Errors: ');
    console.log(error);
    console.log('handleFileAdded() File just added: ' + file.filename);
    console.log('handleFileAdded() File Object: ');
    console.log(file);

    this.retrieveFileSignature(file.filename, this.state.uniqueIdentifier);
  }

  handleRemoveFile(file) {
    for (let i in this.fileList) {
      let currentFile = this.fileList[i];
      if (currentFile['filename'] === file.filename) {
        console.log('Removing: ' + file.filename + ' at index: ' + i);
        this.fileList.splice(i, 1);
        this.setState({
          fileList: [...this.fileList],
        });
      }
    }

    console.log(this.state.fileList);
  }

  getFileSignatureFromList(file) {
    let uploadedFileName = file.name || '';
    console.log('getFileSignatureFromList() We are looking for: ' + uploadedFileName);

    for (let i in this.fileList) {
      let currentFile = this.fileList[i];
      if (currentFile['filename'] === uploadedFileName) {
        console.log('getFileSignatureFromList() Item found at index: ' + i);
        let creds = this.fileList[i]['creds'];
        return creds;
      }
    }
    // If not found, return null
    return null;
  }

  filesUpdated({ fileItems }) {
    // Set current file objects to this.state
    this.setState({
      files: fileItems.map(fileItem => fileItem.file),
    });
  }

  render() {
    return (
      <div>
        <header>
          {/* // Then we need to pass FilePond properties as attributes */}
          <FilePond
            ref={ref => (this.pond = ref)}
            allowMultiple={true}
            maxFiles={10}
            /* FilePond allows a custom process to handle uploads */
            server={{
              process: this.handleProcessing.bind(this),
            }}
            oninit={() => this.handleInit()}
            /* OnAddFile we are going to request a token for that file, and update a dictionary with the tokens */
            onaddfile={(error, file) => this.handleFileAdded(error, file)}
            /* OnRemoveFile we are going to find the file in the list and splice it (remove it) */
            onremovefile={file => this.handleRemoveFile(file)}
            onupdatefiles={fileItems => this.filesUpdated({ fileItems })}
          >
            {/* Update current files  */}
            {this.state.files.map(file => (
              <File key={file} src={file} origin="local" />
            ))}
          </FilePond>
        </header>
      </div>
    );
  }
}

export default FileUploadWidget;
