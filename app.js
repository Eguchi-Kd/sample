async function init() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // GLTFLoaderを使用して3Dモデルを読み込む
    const loader = new THREE.GLTFLoader();
    loader.load('model.glb', function(gltf) {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(0, 0, 0); // モデルの位置を調整
    }, undefined, function(error) {
        console.error(error);
    });

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

function capture() {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const rendererCanvas = document.getElementById('canvas');
    context.drawImage(rendererCanvas, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    downloadImage(dataUrl, 'capture.png');
}

function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
}

init();
