from pathlib import Path
path = Path('components/landing-page-component.js')
text = path.read_text(encoding='utf-8')
old1 = "const ambientLight = new THREE.AmbientLight(0x96b5ff, 0.82);\n      const hemiLight = new THREE.HemisphereLight(0x8899ff, 0x110022, 0.4);\n      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);\n      directionalLight.position.set(14, 9, 15);\n      const fillLight = new THREE.DirectionalLight(0x8899ff, 0.68);\n      fillLight.position.set(-10, -4, -12);\n      const backLight = new THREE.DirectionalLight(0x7788cc, 0.28);\n      backLight.position.set(-14, 5, -8);\n      const pointLight = new THREE.PointLight(0xffffff, 0.9, 160);"
new1 = "const ambientLight = new THREE.AmbientLight(0x96b5ff, 0.92);\n      const hemiLight = new THREE.HemisphereLight(0x8899ff, 0x110022, 0.4);\n      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);\n      directionalLight.position.set(14, 9, 15);\n      const fillLight = new THREE.DirectionalLight(0x8899ff, 0.82);\n      fillLight.position.set(-10, -4, -12);\n      const backLight = new THREE.DirectionalLight(0x7788cc, 0.38);\n      backLight.position.set(-14, 5, -8);\n      const pointLight = new THREE.PointLight(0xffffff, 0.9, 160);"
old2 = "        const material = new THREE.MeshStandardMaterial({\n          color: materialColor,\n          map: texture,\n          roughness: 0.64,\n          metalness: 0.01,\n          clearcoat: 0.0,\n          clearcoatRoughness: 0.8,\n          emissive: 0x020202,\n          emissiveIntensity: 0.01,\n          envMapIntensity: 0.14,\n        });"
new2 = "        const material = new THREE.MeshPhongMaterial({\n          color: materialColor,\n          map: texture,\n          shininess: 10,\n          specular: 0x888888,\n          emissive: 0x0c1018,\n          emissiveIntensity: 0.02,\n        });"
if old1 not in text:
    raise SystemExit('Light block not found')
if old2 not in text:
    raise SystemExit('Material block not found')
text = text.replace(old1, new1, 1)
text = text.replace(old2, new2, 1)
path.write_text(text, encoding='utf-8')
print('patched lights and material')
