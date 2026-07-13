from pathlib import Path
path = Path('components/landing-page-component.js')
text = path.read_text(encoding='utf-8')
old_material = '''        const material = new THREE.MeshStandardMaterial({
          color,
          map: texture,
          roughness: 0.62,
          metalness: 0.02,
          clearcoat: 0.03,
          clearcoatRoughness: 0.6,
          emissive: 0x020202,
          emissiveIntensity: 0.018,
          envMapIntensity: 0.18,
        });'''
new_material = '''        const materialColor = texture ? 0xffffff : color;
        const material = new THREE.MeshStandardMaterial({
          color: materialColor,
          map: texture,
          roughness: 0.64,
          metalness: 0.01,
          clearcoat: 0.0,
          clearcoatRoughness: 0.8,
          emissive: 0x020202,
          emissiveIntensity: 0.01,
          envMapIntensity: 0.14,
        });'''
old_atmosphere = "const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.02, 40, 40);"
new_atmosphere = "const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.015, 40, 40);"
old_earth = "earth: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',"
new_earth = "earth: 'https://threejs.org/examples/textures/planets/earthmap1k.jpg',"
if old_material not in text:
    raise SystemExit('Material block not found')
if old_atmosphere not in text:
    raise SystemExit('Atmosphere geometry line not found')
if old_earth not in text:
    raise SystemExit('Earth texture URL not found')
text = text.replace(old_material, new_material, 1)
text = text.replace(old_atmosphere, new_atmosphere, 1)
text = text.replace(old_earth, new_earth, 1)
path.write_text(text, encoding='utf-8')
print('patched')
