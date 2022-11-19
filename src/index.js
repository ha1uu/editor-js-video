require("./index.css").toString()

class Video {
  rootClass = 'editor-js-video-plugin';
  title = null;
  video = null;
  headers = {};
  uploadFileName = 'file';
  videoLoading = false;
  endpoint = '/';

  constructor({data, api, config}){
    this.title = data.title;
    this.video = data.video;
    this.api = api;
    if (config) {
      if (config.headers) {
        this.headers = config.headers;
      }
      if (config.endpoint) {
        this.endpoint = config.endpoint;
      }
      if (config.uploadFileName) {
        this.uploadFileName = config.uploadFileName;
      }
    }
  }

  render(){
    this.root = document.createElement('div');
    this.root.classList.add(this.rootClass);
    this.root.classList.add('cdx-block');
    this.redraw();
    return this.root;
  }

  async handleFileUpload(e) {
    if (e.target.files[0]) {
      let fd = new FormData();
      fd.append(this.uploadFileName, e.target.files[0])

      let data = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: fd
      }).then((res) => res.json());
      return data.file
    }
  }

  redraw() {
    let videoLabel = `<label class="${this.rootClass}__upload cdx-button ${this.videoLoading ? 'ctx-loader' : ''}">
      <input type="file" class="${this.rootClass}__hidden" accept="video/*" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 3.993C3 3.445 3.445 3 3.993 3h16.014c.548 0 .993.445.993.993v16.014a.994.994 0 0 1-.993.993H3.993A.994.994 0 0 1 3 20.007V3.993zM5 5v14h14V5H5zm5.622 3.415l4.879 3.252a.4.4 0 0 1 0 .666l-4.88 3.252a.4.4 0 0 1-.621-.332V8.747a.4.4 0 0 1 .622-.332z"/></svg>
      <span>Добавить видео</span>
    </label>`;
    let videoPlayer = `<div class="${this.rootClass}__video">
      <video controls src="${this.video}"></video>
      <button type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg></button>
    </div>`;

    this.root.innerHTML = `<div class="${this.rootClass}__video">${this.video ? videoPlayer : videoLabel}</div>
      <input type="text" placeholder="Название видео" class="cdx-input ${this.rootClass}__title" />`

    let titleInput = this.root.querySelector(`.${this.rootClass}__title`);
    titleInput.value = this.title || '';
    this.api.listeners.on(titleInput, 'input', (e) => {
      this.title = e.target.value;
    }, false);

    if (this.video) {
      this.api.listeners.on(this.root.querySelector(`.${this.rootClass}__video button`), 'click', () => {
        if (confirm("Вы уверены?")) {
          this.video = null;
          this.redraw();
        }
      }, false);
    } else {
      this.api.listeners.on(this.root.querySelector(`.${this.rootClass}__upload input`), 'input', (e) => {
        this.videoLoading = true;
        this.handleFileUpload(e).then((file) => {
          this.video = file;
        }).catch((e) => {
          console.error(e.message)
        }).finally(() => {
          this.videoLoading = false;
          this.redraw();
        })
      }, false);
    }

  }

  save(){
    return {
      title: this.title,
      video: this.video,
    };
  }

  static get toolbox() {
    return {
      title: 'Видео',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 3.993C3 3.445 3.445 3 3.993 3h16.014c.548 0 .993.445.993.993v16.014a.994.994 0 0 1-.993.993H3.993A.994.994 0 0 1 3 20.007V3.993zM5 5v14h14V5H5zm5.622 3.415l4.879 3.252a.4.4 0 0 1 0 .666l-4.88 3.252a.4.4 0 0 1-.621-.332V8.747a.4.4 0 0 1 .622-.332z"/></svg>'
    };
  }
}

module.exports = Video;