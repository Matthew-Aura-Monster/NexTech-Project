from pathlib import Path
path = Path('components/landing-page-component.js')
text = path.read_text(encoding='utf-8')
old = '''        const material = new THREE.MeshStandardMaterial({
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
new = '''        const materialColor = texture ? 0xffffff : color;
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
if old not in text:
    raise SystemExit('Material block not found')
text = text.replace(old, new, 1)
path.write_text(text, encoding='utf-8')
print('patched')
