/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");



class ThreeJSContainer {
    scene;
    light;
    fragmentsVelocity;
    triGroup;
    rectGroup;
    fragmentRotation;
    isBreakedDiamond = false;
    constructor() {
    }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        let renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x000000));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        //カメラの設定
        let camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        let orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        const clock = new three__WEBPACK_IMPORTED_MODULE_1__.Clock();
        // 物理演算空間
        const world = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, -9.82, 0) });
        // 摩擦係数
        world.defaultContactMaterial.friction = 0.3;
        // 反発係数
        world.defaultContactMaterial.restitution = 0.0;
        /* ひし形 */
        let diamondGeo = new three__WEBPACK_IMPORTED_MODULE_1__.OctahedronGeometry(7, 0);
        let diamondMat = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0xb8b8e6, emissive: 0x100548, side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide, flatShading: true });
        let diamondMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(diamondGeo, diamondMat);
        diamondMesh.position.y = 25;
        this.scene.add(diamondMesh);
        // ひし形(物理演算空間)
        const diamondShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(3.5, 3.5, 3.5));
        const diamondBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 6 });
        diamondBody.addShape(diamondShape);
        diamondBody.position.set(diamondMesh.position.x, diamondMesh.position.y, diamondMesh.position.z);
        diamondBody.quaternion.set(diamondMesh.quaternion.x, diamondMesh.quaternion.y, diamondMesh.quaternion.z, diamondMesh.quaternion.w);
        world.addBody(diamondBody);
        /* 地面 */
        let planeGeo = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(40, 40);
        let planeMat = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0x221e33, emissive: 0x171325, side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide, flatShading: true });
        let planeMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeo, planeMat);
        planeMesh.rotation.x = three__WEBPACK_IMPORTED_MODULE_1__.MathUtils.degToRad(-90);
        planeMesh.position.y = -12;
        this.scene.add(planeMesh);
        /* 破片 */
        const fragmentNum = 16; // 破片の数
        this.fragmentsVelocity = [];
        this.fragmentRotation = [];
        this.triGroup = [];
        this.rectGroup = [];
        let scale;
        // マテリアル
        let lineMat = new three__WEBPACK_IMPORTED_MODULE_1__.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        let meshMat = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0xb8b8e6, emissive: 0x0b0335, side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide, flatShading: true });
        // 三角形の形状を定義
        let drawTriangles = () => {
            let shape = new three__WEBPACK_IMPORTED_MODULE_1__.Shape();
            shape.moveTo(-1.5, 0.4);
            shape.lineTo(0, 0.6);
            shape.lineTo(-0.5, 0);
            return shape;
        };
        // 四角形の形状を定義
        let drawRect = () => {
            let shape = new three__WEBPACK_IMPORTED_MODULE_1__.Shape();
            // 四角形の形状を定義
            shape.moveTo(-0.9, 0.4);
            shape.lineTo(0, 0.6);
            shape.lineTo(0.7, 0.1);
            shape.lineTo(-0.5, 0);
            return shape;
        };
        // 破片の個数分ループ　破片生成
        for (let i = 0; i < fragmentNum; i++) {
            // 散らばる方角、速度
            this.fragmentsVelocity.push(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-4 + 8 * Math.random(), 1 + 4 * Math.random(), -4 + 8 * Math.random()));
            // 回転速度
            this.fragmentRotation.push(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-0.5 + 1 * Math.random(), -1 + 2 * Math.random(), -0.5 + 1 * Math.random()));
            // 三角形
            let trianglesGeo = new three__WEBPACK_IMPORTED_MODULE_1__.ShapeGeometry(drawTriangles());
            this.triGroup[i] = new three__WEBPACK_IMPORTED_MODULE_1__.Group();
            this.triGroup[i].add(new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(trianglesGeo, meshMat));
            this.triGroup[i].add(new three__WEBPACK_IMPORTED_MODULE_1__.LineSegments(trianglesGeo, lineMat));
            this.triGroup[i].position.set(0, -10, 0);
            scale = 8 * Math.random();
            this.triGroup[i].scale.set(scale, scale, scale);
            this.triGroup[i].visible = false;
            this.scene.add(this.triGroup[i]);
            // 散らばる方角、速度
            this.fragmentsVelocity.push(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-4 + 8 * Math.random(), 1 + 4 * Math.random(), -4 + 8 * Math.random()));
            // 回転速度
            this.fragmentRotation.push(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-0.5 + 1 * Math.random(), -1 + 2 * Math.random(), -0.5 + 1 * Math.random()));
            // 四角形
            let rectGeo = new three__WEBPACK_IMPORTED_MODULE_1__.ShapeGeometry(drawRect());
            this.rectGroup[i] = new three__WEBPACK_IMPORTED_MODULE_1__.Group();
            this.rectGroup[i].add(new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(rectGeo, meshMat));
            this.rectGroup[i].add(new three__WEBPACK_IMPORTED_MODULE_1__.LineSegments(rectGeo, lineMat));
            this.rectGroup[i].position.set(0, -10, 0);
            scale = 8 * Math.random();
            this.rectGroup[i].scale.set(scale, scale, scale);
            this.rectGroup[i].visible = false;
            this.scene.add(this.rectGroup[i]);
        }
        //ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff);
        let lvec = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update = (time) => {
            const deltaTime = clock.getDelta();
            // 物理演算
            world.fixedStep();
            diamondMesh.position.set(diamondBody.position.x, diamondBody.position.y, diamondBody.position.z);
            diamondMesh.quaternion.set(diamondBody.quaternion.x, diamondBody.quaternion.y, diamondBody.quaternion.z, diamondBody.quaternion.w);
            if (diamondMesh.position.y <= -5) {
                diamondMesh.visible = false;
                planeMesh.visible = false;
            }
            if (diamondMesh.position.y <= -9.5) {
                this.isBreakedDiamond = true;
                planeMesh.visible = true;
                for (let i = 0; i < fragmentNum; i++) {
                    this.triGroup[i].visible = true;
                    this.rectGroup[i].visible = true;
                }
            }
            if (this.isBreakedDiamond) {
                for (let i = 0; i < fragmentNum; i++) {
                    // 位置
                    this.triGroup[i].position.x += this.fragmentsVelocity[i].x * deltaTime;
                    this.triGroup[i].position.y += this.fragmentsVelocity[i].y * deltaTime;
                    this.triGroup[i].position.z += this.fragmentsVelocity[i].z * deltaTime;
                    this.rectGroup[i].position.x += this.fragmentsVelocity[i + fragmentNum].x * deltaTime;
                    this.rectGroup[i].position.y += this.fragmentsVelocity[i + fragmentNum].y * deltaTime;
                    this.rectGroup[i].position.z += this.fragmentsVelocity[i + fragmentNum].z * deltaTime;
                    // 回転
                    this.triGroup[i].rotateX(this.fragmentRotation[i].x * deltaTime);
                    this.triGroup[i].rotateY(this.fragmentRotation[i].y * deltaTime);
                    this.triGroup[i].rotateZ(this.fragmentRotation[i].z * deltaTime);
                    this.rectGroup[i].rotateX(this.fragmentRotation[i + fragmentNum].x * deltaTime);
                    this.rectGroup[i].rotateY(this.fragmentRotation[i + fragmentNum].y * deltaTime);
                    this.rectGroup[i].rotateZ(this.fragmentRotation[i + fragmentNum].z * deltaTime);
                }
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(30, 11, -5));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO29CQUN2RSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO29CQUN0RixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO29CQUN0RixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO29CQUN0RixLQUFLO29CQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7b0JBQ2pFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7b0JBQ2pFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7b0JBQ2pFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO29CQUNoRixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztvQkFDaEYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7aUJBQ25GO2FBQ0o7WUFDRCxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNKO0FBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO0FBRWxELFNBQVMsSUFBSTtJQUNULElBQUksU0FBUyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztJQUV2QyxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLDBDQUFhLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEYsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEMsQ0FBQzs7Ozs7OztVQ3RORDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBDQU5OT04gZnJvbSAnY2Fubm9uLWVzJztcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIGZyYWdtZW50c1ZlbG9jaXR5OiBUSFJFRS5WZWN0b3IzW107XG4gICAgcHJpdmF0ZSB0cmlHcm91cDogVEhSRUUuR3JvdXBbXTtcbiAgICBwcml2YXRlIHJlY3RHcm91cDogVEhSRUUuR3JvdXBbXTtcbiAgICBwcml2YXRlIGZyYWdtZW50Um90YXRpb246IFRIUkVFLlZlY3RvcjNbXVxuICAgIHByaXZhdGUgaXNCcmVha2VkRGlhbW9uZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbiAgICAvLyDnlLvpnaLpg6jliIbjga7kvZzmiJAo6KGo56S644GZ44KL5p6g44GU44Go44GrKSpcbiAgICBwdWJsaWMgY3JlYXRlUmVuZGVyZXJET00gPSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGNhbWVyYVBvczogVEhSRUUuVmVjdG9yMykgPT4ge1xuICAgICAgICBsZXQgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDAwMDAwMCkpO1xuICAgICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7IC8v44K344Oj44OJ44Km44Oe44OD44OX44KS5pyJ5Yq544Gr44GZ44KLXG5cbiAgICAgICAgLy/jgqvjg6Hjg6njga7oqK3lrppcbiAgICAgICAgbGV0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XG4gICAgICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuXG4gICAgICAgIGxldCBvcmJpdENvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jHJlbmRlclxuICAgICAgICAvLyByZXFlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgbGV0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcblxuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XG4gICAgICAgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuICAgIH1cblxuICAgIC8vIOOCt+ODvOODs+OBruS9nOaIkCjlhajkvZPjgacx5ZueKVxuICAgIHByaXZhdGUgY3JlYXRlU2NlbmUgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICAgICAgY29uc3QgY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcblxuICAgICAgICAvLyDniannkIbmvJTnrpfnqbrplpNcbiAgICAgICAgY29uc3Qgd29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHsgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKSB9KTtcbiAgICAgICAgLy8g5pGp5pOm5L+C5pWwXG4gICAgICAgIHdvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwuZnJpY3Rpb24gPSAwLjM7XG4gICAgICAgIC8vIOWPjeeZuuS/guaVsFxuICAgICAgICB3b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uID0gMC4wO1xuXG4gICAgICAgIC8qIOOBsuOBl+W9oiAqL1xuICAgICAgICBsZXQgZGlhbW9uZEdlbyA9IG5ldyBUSFJFRS5PY3RhaGVkcm9uR2VvbWV0cnkoNywgMCk7XG4gICAgICAgIGxldCBkaWFtb25kTWF0ID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IDB4YjhiOGU2LCBlbWlzc2l2ZTogMHgxMDA1NDgsIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsIGZsYXRTaGFkaW5nOiB0cnVlIH0pO1xuICAgICAgICBsZXQgZGlhbW9uZE1lc2ggPSBuZXcgVEhSRUUuTWVzaChkaWFtb25kR2VvLCBkaWFtb25kTWF0KTtcbiAgICAgICAgZGlhbW9uZE1lc2gucG9zaXRpb24ueSA9IDI1O1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChkaWFtb25kTWVzaCk7XG5cbiAgICAgICAgLy8g44Gy44GX5b2iKOeJqeeQhua8lOeul+epuumWkylcbiAgICAgICAgY29uc3QgZGlhbW9uZFNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKDMuNSwgMy41LCAzLjUpKTtcbiAgICAgICAgY29uc3QgZGlhbW9uZEJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiA2IH0pO1xuICAgICAgICBkaWFtb25kQm9keS5hZGRTaGFwZShkaWFtb25kU2hhcGUpO1xuXG4gICAgICAgIGRpYW1vbmRCb2R5LnBvc2l0aW9uLnNldChkaWFtb25kTWVzaC5wb3NpdGlvbi54LCBkaWFtb25kTWVzaC5wb3NpdGlvbi55LCBkaWFtb25kTWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAgZGlhbW9uZEJvZHkucXVhdGVybmlvbi5zZXQoZGlhbW9uZE1lc2gucXVhdGVybmlvbi54LCBkaWFtb25kTWVzaC5xdWF0ZXJuaW9uLnksIGRpYW1vbmRNZXNoLnF1YXRlcm5pb24ueiwgZGlhbW9uZE1lc2gucXVhdGVybmlvbi53KTtcbiAgICAgICAgd29ybGQuYWRkQm9keShkaWFtb25kQm9keSk7XG5cblxuICAgICAgICAvKiDlnLDpnaIgKi9cbiAgICAgICAgbGV0IHBsYW5lR2VvID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoNDAsIDQwKTtcbiAgICAgICAgbGV0IHBsYW5lTWF0ID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IDB4MjIxZTMzLCBlbWlzc2l2ZTogMHgxNzEzMjUsIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsIGZsYXRTaGFkaW5nOiB0cnVlIH0pO1xuICAgICAgICBsZXQgcGxhbmVNZXNoID0gbmV3IFRIUkVFLk1lc2gocGxhbmVHZW8sIHBsYW5lTWF0KTtcbiAgICAgICAgcGxhbmVNZXNoLnJvdGF0aW9uLnggPSBUSFJFRS5NYXRoVXRpbHMuZGVnVG9SYWQoLTkwKTtcbiAgICAgICAgcGxhbmVNZXNoLnBvc2l0aW9uLnkgPSAtMTI7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHBsYW5lTWVzaCk7XG5cblxuICAgICAgICAvKiDnoLTniYcgKi9cbiAgICAgICAgY29uc3QgZnJhZ21lbnROdW0gPSAxNjsgLy8g56C054mH44Gu5pWwXG4gICAgICAgIHRoaXMuZnJhZ21lbnRzVmVsb2NpdHkgPSBbXTtcbiAgICAgICAgdGhpcy5mcmFnbWVudFJvdGF0aW9uID0gW107XG4gICAgICAgIHRoaXMudHJpR3JvdXAgPSBbXTtcbiAgICAgICAgdGhpcy5yZWN0R3JvdXAgPSBbXTtcbiAgICAgICAgbGV0IHNjYWxlO1xuXG4gICAgICAgIC8vIOODnuODhuODquOCouODq1xuICAgICAgICBsZXQgbGluZU1hdCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweGZmZmZmZiwgdHJhbnNwYXJlbnQ6IHRydWUsIG9wYWNpdHk6IDAuNSB9KTtcbiAgICAgICAgbGV0IG1lc2hNYXQgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHhiOGI4ZTYsIGVtaXNzaXZlOiAweDBiMDMzNSwgc2lkZTogVEhSRUUuRG91YmxlU2lkZSwgZmxhdFNoYWRpbmc6IHRydWUgfSk7XG5cbiAgICAgICAgLy8g5LiJ6KeS5b2i44Gu5b2i54q244KS5a6a576pXG4gICAgICAgIGxldCBkcmF3VHJpYW5nbGVzID0gKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNoYXBlID0gbmV3IFRIUkVFLlNoYXBlKCk7XG4gICAgICAgICAgICBzaGFwZS5tb3ZlVG8oLTEuNSwgMC40KTtcbiAgICAgICAgICAgIHNoYXBlLmxpbmVUbygwLCAwLjYpO1xuICAgICAgICAgICAgc2hhcGUubGluZVRvKC0wLjUsIDApO1xuICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICB9XG4gICAgICAgIC8vIOWbm+inkuW9ouOBruW9oueKtuOCkuWumue+qVxuICAgICAgICBsZXQgZHJhd1JlY3QgPSAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc2hhcGUgPSBuZXcgVEhSRUUuU2hhcGUoKTtcbiAgICAgICAgICAgIC8vIOWbm+inkuW9ouOBruW9oueKtuOCkuWumue+qVxuICAgICAgICAgICAgc2hhcGUubW92ZVRvKC0wLjksIDAuNCk7XG4gICAgICAgICAgICBzaGFwZS5saW5lVG8oMCwgMC42KTtcbiAgICAgICAgICAgIHNoYXBlLmxpbmVUbygwLjcsIDAuMSk7XG4gICAgICAgICAgICBzaGFwZS5saW5lVG8oLTAuNSwgMCk7XG4gICAgICAgICAgICByZXR1cm4gc2hhcGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDnoLTniYfjga7lgIvmlbDliIbjg6vjg7zjg5fjgIDnoLTniYfnlJ/miJBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFnbWVudE51bTsgaSsrKSB7XG4gICAgICAgICAgICAvLyDmlaPjgonjgbDjgovmlrnop5LjgIHpgJ/luqZcbiAgICAgICAgICAgIHRoaXMuZnJhZ21lbnRzVmVsb2NpdHkucHVzaChuZXcgVEhSRUUuVmVjdG9yMygtNCArIDggKiBNYXRoLnJhbmRvbSgpLCAxICsgNCAqIE1hdGgucmFuZG9tKCksIC00ICsgOCAqIE1hdGgucmFuZG9tKCkpKTtcbiAgICAgICAgICAgIC8vIOWbnui7oumAn+W6plxuICAgICAgICAgICAgdGhpcy5mcmFnbWVudFJvdGF0aW9uLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoLTAuNSArIDEgKiBNYXRoLnJhbmRvbSgpLCAtMSArIDIgKiBNYXRoLnJhbmRvbSgpLCAtMC41ICsgMSAqIE1hdGgucmFuZG9tKCkpKTtcbiAgICAgICAgICAgIC8vIOS4ieinkuW9olxuICAgICAgICAgICAgbGV0IHRyaWFuZ2xlc0dlbyA9IG5ldyBUSFJFRS5TaGFwZUdlb21ldHJ5KGRyYXdUcmlhbmdsZXMoKSk7XG4gICAgICAgICAgICB0aGlzLnRyaUdyb3VwW2ldID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICAgICAgICB0aGlzLnRyaUdyb3VwW2ldLmFkZChuZXcgVEhSRUUuTWVzaCh0cmlhbmdsZXNHZW8sIG1lc2hNYXQpKTtcbiAgICAgICAgICAgIHRoaXMudHJpR3JvdXBbaV0uYWRkKG5ldyBUSFJFRS5MaW5lU2VnbWVudHModHJpYW5nbGVzR2VvLCBsaW5lTWF0KSk7XG5cbiAgICAgICAgICAgIHRoaXMudHJpR3JvdXBbaV0ucG9zaXRpb24uc2V0KDAsIC0xMCwgMCk7XG4gICAgICAgICAgICBzY2FsZSA9IDggKiBNYXRoLnJhbmRvbSgpXG4gICAgICAgICAgICB0aGlzLnRyaUdyb3VwW2ldLnNjYWxlLnNldChzY2FsZSwgc2NhbGUsIHNjYWxlKTtcbiAgICAgICAgICAgIHRoaXMudHJpR3JvdXBbaV0udmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnRyaUdyb3VwW2ldKTtcblxuICAgICAgICAgICAgLy8g5pWj44KJ44Gw44KL5pa56KeS44CB6YCf5bqmXG4gICAgICAgICAgICB0aGlzLmZyYWdtZW50c1ZlbG9jaXR5LnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoLTQgKyA4ICogTWF0aC5yYW5kb20oKSwgMSArIDQgKiBNYXRoLnJhbmRvbSgpLCAtNCArIDggKiBNYXRoLnJhbmRvbSgpKSk7XG4gICAgICAgICAgICAvLyDlm57ou6LpgJ/luqZcbiAgICAgICAgICAgIHRoaXMuZnJhZ21lbnRSb3RhdGlvbi5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKC0wLjUgKyAxICogTWF0aC5yYW5kb20oKSwgLTEgKyAyICogTWF0aC5yYW5kb20oKSwgLTAuNSArIDEgKiBNYXRoLnJhbmRvbSgpKSk7XG4gICAgICAgICAgICAvLyDlm5vop5LlvaJcbiAgICAgICAgICAgIGxldCByZWN0R2VvID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkoZHJhd1JlY3QoKSk7XG4gICAgICAgICAgICB0aGlzLnJlY3RHcm91cFtpXSA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgICAgICAgdGhpcy5yZWN0R3JvdXBbaV0uYWRkKG5ldyBUSFJFRS5NZXNoKHJlY3RHZW8sIG1lc2hNYXQpKTtcbiAgICAgICAgICAgIHRoaXMucmVjdEdyb3VwW2ldLmFkZChuZXcgVEhSRUUuTGluZVNlZ21lbnRzKHJlY3RHZW8sIGxpbmVNYXQpKTtcblxuICAgICAgICAgICAgdGhpcy5yZWN0R3JvdXBbaV0ucG9zaXRpb24uc2V0KDAsIC0xMCwgMCk7XG4gICAgICAgICAgICBzY2FsZSA9IDggKiBNYXRoLnJhbmRvbSgpXG4gICAgICAgICAgICB0aGlzLnJlY3RHcm91cFtpXS5zY2FsZS5zZXQoc2NhbGUsIHNjYWxlLCBzY2FsZSk7XG5cbiAgICAgICAgICAgIHRoaXMucmVjdEdyb3VwW2ldLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5yZWN0R3JvdXBbaV0pO1xuICAgICAgICB9XG5cblxuICAgICAgICAvL+ODqeOCpOODiOOBruioreWumlxuICAgICAgICB0aGlzLmxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xuICAgICAgICBsZXQgbHZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDEsIDEsIDEpLm5vcm1hbGl6ZSgpO1xuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodCk7XG5cbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yM5pu05pawXG4gICAgICAgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZWx0YVRpbWUgPSBjbG9jay5nZXREZWx0YSgpO1xuXG4gICAgICAgICAgICAvLyDniannkIbmvJTnrpdcbiAgICAgICAgICAgIHdvcmxkLmZpeGVkU3RlcCgpO1xuICAgICAgICAgICAgZGlhbW9uZE1lc2gucG9zaXRpb24uc2V0KGRpYW1vbmRCb2R5LnBvc2l0aW9uLngsIGRpYW1vbmRCb2R5LnBvc2l0aW9uLnksIGRpYW1vbmRCb2R5LnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgZGlhbW9uZE1lc2gucXVhdGVybmlvbi5zZXQoZGlhbW9uZEJvZHkucXVhdGVybmlvbi54LCBkaWFtb25kQm9keS5xdWF0ZXJuaW9uLnksIGRpYW1vbmRCb2R5LnF1YXRlcm5pb24ueiwgZGlhbW9uZEJvZHkucXVhdGVybmlvbi53KTtcblxuICAgICAgICAgICAgaWYgKGRpYW1vbmRNZXNoLnBvc2l0aW9uLnkgPD0gLTUpIHtcbiAgICAgICAgICAgICAgICBkaWFtb25kTWVzaC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcGxhbmVNZXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkaWFtb25kTWVzaC5wb3NpdGlvbi55IDw9IC05LjUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQnJlYWtlZERpYW1vbmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHBsYW5lTWVzaC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYWdtZW50TnVtOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlHcm91cFtpXS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWN0R3JvdXBbaV0udmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaXNCcmVha2VkRGlhbW9uZCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhZ21lbnROdW07IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyDkvY3nva5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlHcm91cFtpXS5wb3NpdGlvbi54ICs9IHRoaXMuZnJhZ21lbnRzVmVsb2NpdHlbaV0ueCAqIGRlbHRhVGltZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlHcm91cFtpXS5wb3NpdGlvbi55ICs9IHRoaXMuZnJhZ21lbnRzVmVsb2NpdHlbaV0ueSAqIGRlbHRhVGltZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlHcm91cFtpXS5wb3NpdGlvbi56ICs9IHRoaXMuZnJhZ21lbnRzVmVsb2NpdHlbaV0ueiAqIGRlbHRhVGltZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWN0R3JvdXBbaV0ucG9zaXRpb24ueCArPSB0aGlzLmZyYWdtZW50c1ZlbG9jaXR5W2kgKyBmcmFnbWVudE51bV0ueCAqIGRlbHRhVGltZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWN0R3JvdXBbaV0ucG9zaXRpb24ueSArPSB0aGlzLmZyYWdtZW50c1ZlbG9jaXR5W2kgKyBmcmFnbWVudE51bV0ueSAqIGRlbHRhVGltZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWN0R3JvdXBbaV0ucG9zaXRpb24ueiArPSB0aGlzLmZyYWdtZW50c1ZlbG9jaXR5W2kgKyBmcmFnbWVudE51bV0ueiAqIGRlbHRhVGltZTtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Zue6LuiXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpR3JvdXBbaV0ucm90YXRlWCh0aGlzLmZyYWdtZW50Um90YXRpb25baV0ueCAqIGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpR3JvdXBbaV0ucm90YXRlWSh0aGlzLmZyYWdtZW50Um90YXRpb25baV0ueSAqIGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpR3JvdXBbaV0ucm90YXRlWih0aGlzLmZyYWdtZW50Um90YXRpb25baV0ueiAqIGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjdEdyb3VwW2ldLnJvdGF0ZVgodGhpcy5mcmFnbWVudFJvdGF0aW9uW2kgKyBmcmFnbWVudE51bV0ueCAqIGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjdEdyb3VwW2ldLnJvdGF0ZVkodGhpcy5mcmFnbWVudFJvdGF0aW9uW2kgKyBmcmFnbWVudE51bV0ueSAqIGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjdEdyb3VwW2ldLnJvdGF0ZVoodGhpcy5mcmFnbWVudFJvdGF0aW9uW2kgKyBmcmFnbWVudE51bV0ueiAqIGRlbHRhVGltZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgfVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG5cbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKDMwLCAxMSwgLTUpKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiLWU1OGJkMlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==