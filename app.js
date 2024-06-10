async function init() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 環境光を追加
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // GLTFLoaderを使用して3Dモデルを読み込む
    const loader = new THREE.GLTFLoader();
    loader.load('model.glb', function(gltf) {
        const model = gltf.scene;
        scene.add(model);

        // モデルの位置とスケールを調整
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);

        // モデルを常に画面中央に配置
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);  // モデルの中心を原点に移動

        // カメラの適切な位置を設定
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));
        camera.position.z = cameraZ;

        // カメラのクリッピング距離を調整
        const minZ = box.min.z;
        const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;
        camera.far = cameraToFarEdge * 3;
        camera.updateProjectionMatrix();
    }, undefined, function(error) {
        console.error(error);
    });

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
