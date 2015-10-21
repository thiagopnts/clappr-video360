import './style.css'
import {HTML5Video} from 'clappr'
import Viewer from './viewer'
import {
    Scene,
    PerspectiveCamera,
    Vector3,
    WebGLRenderer,
    MeshBasicMaterial,
    Texture,
    BoxGeometry,
    MeshFaceMaterial,
    Mesh,
    Math as TMath
} from 'three.js'

export default class Playback360 extends HTML5Video {
    constructor(options) {
        super(options);
        this.$el.hide();
        this.viewer = new Viewer({video: this.el, height: options.height, width: options.width});
    }

    render() {
        super.render();
        setTimeout(() => {
            this.el.parentElement.appendChild(this.viewer.render());
        }, 0);
        return this;
    }

}

Playback360.canPlay = (source) => {
    return (source || '').match(/#360$/);
}
