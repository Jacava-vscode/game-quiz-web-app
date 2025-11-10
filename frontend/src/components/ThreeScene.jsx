import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const ThreeScene = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.z = 4

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const geometry = new THREE.IcosahedronGeometry(1.2, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0x6c5ce7, wireframe: true })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const ambient = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambient)

    const animate = () => {
      mesh.rotation.x += 0.005
      mesh.rotation.y += 0.01
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      mount.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <div className="hero__canvas" ref={mountRef} />
}

export default ThreeScene
