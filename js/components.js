class NavigationBar extends HTMLElement {

  constructor(){
    super();
    this._shadow = this.attachShadow({mode: 'open'});
  }

  connectedCallback(){

    fetch(this.getAttribute('sitemap'))
  		.then((res) => res.json())
  		.then((data) => {
  			this._shadow.innerHTML = `<style>
          :host {
            display: flex;
            flex: auto;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
          }

          :host a {
            margin: 16px 24px 16px 24px;
            text-align: center;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 1em;
            letter-spacing: .14em;
            color: rgba(130, 130, 130, .57);
            transition: color 140ms cubic-bezier(.33,0,.2,1);
          }

          :host a.active, :host a:hover {
              color: rgb(130, 130, 130);
          }

        </style>`
        + data.pages.map(page => `
          <a href="${(this.getAttribute('prefix') || '') + page.url}" class="${this.getAttribute('current') === page.url ? 'active': ''}">${page.title}</a>
          `).join('');;
  		});
  }

}


window.customElements.define('navigation-bar', NavigationBar);
