export default class DevUtils {

  static keyGrig = 103; // g
  static keyTheme = 99; // c

  static html = `
    <div id="dev-grid">
      <style>
        #dev-grid {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 100000;
        }
        #dev-grid .row > * {
          height: 100vh;
          display: flex;
        }
        #dev-grid .row > *:before {
          content: '';
          display: block;
          width: 100%;
          background-color: rgba(255,0,0,.15);
        }
      </style>
      <div class="container-fluid d-sm-none">
        <div class="row">
          <div class="col-6"></div>
          <div class="col-6"></div>
        </div>
      </div>
      <div class="container-fluid d-none d-sm-block">
        <div class="row">
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-1"></div>
          <div class="col-1"></div>
        </div>
      </div>
    </div>`;

  static init() {
    alert('er')
    return new DevUtils()
  }

  constructor() {
    this.active = false;
    this.state = 0;
    this.themes = ['green', 'azure', 'blue'];

    document.addEventListener('keypress', this.onKeyPress.bind(this));
  }

  onKeyPress(e) {
    if(event.target.tagName.toLowerCase() != 'input') {
      switch(e.keyCode) {
        case DevUtils.keyGrig:
          this.active = !this.active;
          this.active ? this.show() : this.hide();
          break;
        case DevUtils.keyTheme:
          this.state++;
          document.querySelectorAll('.Main, .SiteHeader').forEach((item) => {
            item.setAttribute('data-theme', this.themes[this.state % 3])
          });
          break;
      }
    }
  }

  show() {
    document.body.insertAdjacentHTML('beforeend', DevUtils.html);
  }

  hide() {
    document.getElementById('dev-grid').remove();
  }
}
