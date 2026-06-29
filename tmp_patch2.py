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
old_earth = "earth: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',"
new_earth = "earth: 'https://threejs.org/examples/textures/planets/earthmap1k.jpg',"
changes = 0
if old_material in text:
    text = text.replace(old_material, new_material, 1)
    changes += 1
else:
    print('Material block not found')
if old_earth in text:
    text = text.replace(old_earth, new_earth, 1)
    changes += 1
else:
    print('Earth texture URL not found')
if changes == 0:
    raise SystemExit('No changes applied')
path.write_text(text, encoding='utf-8')
print(f'patched {changes} changes')
