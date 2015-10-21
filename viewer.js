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

export default class Viewer {
    constructor(options) {
        this.video = options.video;
        this.width = options.width;
        this.height = options.height;
        this.isFullScreen = false;
        this.angles = [1, 2, 3, 4, 5, 6].map(() => {
            var canvas = document.createElement('canvas')
            canvas.height = 512;
            canvas.width = 512;
            return canvas;
        });
        // this needs to be computed from video tag refs #1
        this.frames = [
            [0, 0],
            [512, 0],
            [1024, 0],
            [0, 512],
            [512, 512],
            [1024, 512]
        ];
    }

    onMouseUp() {
        this.isUserInteracting = false;
        this.renderer.domElement.classList.remove('dragging');
    }

    onMouseMove(event) {
        if (this.isUserInteracting) {
            this.lon = (this.onPointerDownPointerX - event.clientX) * 0.2 + this.onPointerDownLon;
            this.lat = (event.clientY - this.onPointerDownPointerY) * 0.2 + this.onPointerDownLat;
        }
    }

    onMouseDown(event) {
        event.preventDefault();
        this.isUserInteracting = true;
        this.onPointerDownPointerX = event.clientX;
        this.onPointerDownPointerY = event.clientY;

        this.onPointerDownLon = this.lon;
        this.onPointerDownLat = this.lat;
        this.renderer.domElement.classList.add('dragging');
    }
    onFullScreen() {
        // later, expose fullscreen state from clappr
        if (!this.isFullScreen) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        } else {
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( this.width, this.height );
        }
        this.isFullScreen = !this.isFullScreen;
    }

    render() {
        this.contexts = this.angles.map((canvas) => canvas.getContext('2d'));
        var draw = () => {
            this.frames.forEach((frame, i) => {
                this.contexts[i].clearRect(0, 0, 512, 512);
                this.contexts[i].drawImage(this.video, frame[0], frame[1], 512, 512, 0, 0, 512, 512);
            });

            requestAnimationFrame(draw)
        };
        draw();
        this.isUserInteracting = false;
        this.lon = 90;
        this.lat = 50;
        this.onMouseDownLon = 0;
        this.onMouseDownLat = 0;
        this.phi = 0;
        this.theta = 0;
        this.target = new Vector3();
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, this.width / this.height, 1, 1100);
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        document.addEventListener('webkitfullscreenchange', this.onFullScreen.bind(this), false);
        document.addEventListener('fullscreenchange', this.onFullScreen.bind(this), false);
        document.addEventListener('MSFullscreenChange', this.onFullScreen.bind(this), false);
        document.addEventListener('mozfullscreenchange', this.onFullScreen.bind(this), false);

        this.materials = this.angles.map((angle) => {
            return new MeshBasicMaterial({
                map: new Texture(angle),
                overdraw: 1,
            });
        });

        this.geometry = new BoxGeometry(300, 300, 300, 7, 7, 7);

        this.material = new MeshFaceMaterial(this.materials);
        this.cube = new Mesh(this.geometry, this.material);
        window.cube = this.cube;
        window.camera = this.camera;

        this.cube.scale.x = -1;

        this.scene.add(this.cube);
        for (var i = 0; i < this.cube.geometry.vertices.length; i++) {
            var v = this.cube.geometry.vertices[i];
            v.normalize();
            v.multiplyScalar(500);
        }

        var update =  () => {
            this.materials.forEach((material) => {
                material.map.needsUpdate = true;
            });

            this.lat = Math.max(-90, Math.min(90, this.lat) );
            this.phi = TMath.degToRad(135 - this.lat);
            this.theta = TMath.degToRad(this.lon);

            this.target.x = 200 * Math.sin(this.phi) * Math.cos(this.theta);
            this.target.y = 200 * Math.cos(this.phi);
            this.target.z = 200 * Math.sin(this.phi) * Math.sin(this.theta);

            this.camera.position.copy(this.target).negate();
            this.camera.lookAt(this.target);

            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(update);
        }

        this.renderer.domElement.classList.add('draggable');
        update();
        return this.renderer.domElement;
    }
}
