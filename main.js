import './style.styl'
import Audio from "./src/index.js";
import JsonViewer from 'json-viewer-js/src/jsonViewer.js';

document.querySelector('#app').innerHTML = `
  <div class="editor" id="editorjs"></div>
  <div class="output" id="output"></div>
`

let savedData = {
  blocks: [
    {
      type: "audio",
      data: {
        title: "Lateralus",
        audio: "/test_audio.mp3",
        cover: "/test_cover.jpg"
      }
    }
  ]
}

new EditorJS({
  autofocus: true,
  data: savedData,
  onChange(e) {
    e.saver.save().then((res) => {
      document.querySelector('#output').innerHTML = '<pre></pre>'
      new JsonViewer({
        container: document.querySelector('#output pre'),
        data: JSON.stringify(res),
        theme: 'light',
        expand: true
      });
    });
  },
  tools: {
    audio: {
      class: Audio,
      config: {
        headers: {
          Authorization: "Bearer 2|34O0PaoAtXpAeayiUwYSoWSVlXKbxdNukxmOILQp"
        },
        endpoint: 'http://127.0.0.1:8000/action/uploadeditorfile',
      }
    },
  }
});

