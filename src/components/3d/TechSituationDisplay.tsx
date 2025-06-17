import React, { useRef, useMemo, useCallback, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  Line,
  Html,
  Sphere,
  Box,
  Cylinder,
  Torus,
  Ring,
  Plane,
  Stars,
  Effects,
} from "@react-three/drei";
import {
  Group,
  Vector3,
  Mesh,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending,
  Color,
  MeshStandardMaterial,
  RingGeometry,
  DoubleSide,
  BackSide,
  ShaderMaterial,
} from "three";
import { TECH_COLORS, TECH_3D_CONFIG } from "@/lib/techColors";

/**
 * 3D态势感知场景数据配置
 */
const SITUATION_CONFIG = {
  // 中央核心塔
  centralCore: {
    position: [0, 0, 0] as [number, number, number],
    height: 40,
    radius: 5,
    segments: 32,
    color: TECH_COLORS.primary.cyber,
  },

  // 数据节点配置
  dataNodes: [
    {
      id: "core-alpha",
      position: [20, 15, 20] as [number, number, number],
      type: "core",
      status: "online",
      dataRate: 95,
      connections: 12,
      color: TECH_COLORS.network.core,
    },
    {
      id: "core-beta",
      position: [-20, 15, 20] as [number, number, number],
      type: "core",
      status: "online",
      dataRate: 87,
      connections: 10,
      color: TECH_COLORS.network.core,
    },
    {
      id: "core-gamma",
      position: [20, 15, -20] as [number, number, number],
      type: "core",
      status: "warning",
      dataRate: 76,
      connections: 8,
      color: TECH_COLORS.network.core,
    },
    {
      id: "core-delta",
      position: [-20, 15, -20] as [number, number, number],
      type: "core",
      status: "online",
      dataRate: 92,
      connections: 11,
      color: TECH_COLORS.network.core,
    },
    {
      id: "edge-north",
      position: [0, 8, 35] as [number, number, number],
      type: "edge",
      status: "online",
      dataRate: 65,
      connections: 6,
      color: TECH_COLORS.network.edge,
    },
    {
      id: "edge-south",
      position: [0, 8, -35] as [number, number, number],
      type: "edge",
      status: "processing",
      dataRate: 72,
      connections: 7,
      color: TECH_COLORS.network.edge,
    },
    {
      id: "edge-east",
      position: [35, 8, 0] as [number, number, number],
      type: "edge",
      status: "online",
      dataRate: 58,
      connections: 5,
      color: TECH_COLORS.network.edge,
    },
    {
      id: "edge-west",
      position: [-35, 8, 0] as [number, number, number],
      type: "edge",
      status: "critical",
      dataRate: 43,
      connections: 3,
      color: TECH_COLORS.network.edge,
    },
  ],

  // 数据流连接
  dataConnections: [
    { from: [0, 20, 0], to: [20, 15, 20], bandwidth: 95, type: "primary" },
    { from: [0, 20, 0], to: [-20, 15, 20], bandwidth: 87, type: "primary" },
    { from: [0, 20, 0], to: [20, 15, -20], bandwidth: 76, type: "primary" },
    { from: [0, 20, 0], to: [-20, 15, -20], bandwidth: 92, type: "primary" },
    {
      from: [20, 15, 20],
      to: [0, 8, 35],
      bandwidth: 65,
      type: "secondary",
    },
    {
      from: [-20, 15, 20],
      to: [-35, 8, 0],
      bandwidth: 72,
      type: "secondary",
    },
    {
      from: [20, 15, -20],
      to: [0, 8, -35],
      bandwidth: 43,
      type: "secondary",
    },
    {
      from: [-20, 15, -20],
      to: [35, 8, 0],
      bandwidth: 58,
      type: "secondary",
    },
  ],

  // 防护屏障
  shields: [
    { radius: 45, height: 3, opacity: 0.15, color: TECH_COLORS.primary.neon },
    { radius: 35, height: 2, opacity: 0.2, color: TECH_COLORS.primary.cyber },
    { radius: 25, height: 1, opacity: 0.25, color: TECH_COLORS.primary.matrix },
  ],

  // 扫描波
  scanWaves: [
    { radius: 50, speed: 2, color: TECH_COLORS.material.effects.scan },
    { radius: 40, speed: 1.5, color: TECH_COLORS.material.effects.beam },
    { radius: 30, speed: 1, color: TECH_COLORS.material.effects.hologram },
  ],
};

/**
 * 中央核心塔组件
 */
export function CentralCore() {
  const coreRef = useRef<Group>(null);
  const innerRef = useRef<Mesh>(null);
  const { centralCore } = SITUATION_CONFIG;

  useFrame((state) => {
    if (coreRef.current) {
      // 主塔缓慢旋转
      coreRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }

    if (innerRef.current) {
      // 内核快速旋转
      innerRef.current.rotation.y = -state.clock.getElapsedTime() * 0.3;
      // 脉冲效果
      const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.1 + 1;
      innerRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={coreRef} position={centralCore.position}>
      {/* 外壳塔结构 */}
      <Cylinder
        args={[
          centralCore.radius,
          centralCore.radius * 0.8,
          centralCore.height,
          centralCore.segments,
        ]}
      >
        <meshStandardMaterial
          color={centralCore.color}
          emissive={centralCore.color}
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </Cylinder>

      {/* 内核球体 */}
      <Sphere ref={innerRef} args={[2, 32, 32]} position={[0, 10, 0]}>
        <meshStandardMaterial
          color={TECH_COLORS.primary.plasma}
          emissive={TECH_COLORS.primary.plasma}
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* 能量环 */}
      {[5, 10, 15, 20].map((y, index) => (
        <Ring key={index} args={[4, 6, 32]} position={[0, y, 0]}>
          <meshStandardMaterial
            color={TECH_COLORS.primary.neon}
            emissive={TECH_COLORS.primary.neon}
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
            side={DoubleSide}
          />
        </Ring>
      ))}

      {/* 数据流向上的粒子 */}
      <VerticalParticleStream />

      {/* 全息显示屏 */}
      <HolographicDisplay position={[0, 25, 0]} />
    </group>
  );
}

/**
 * 垂直粒子流
 */
function VerticalParticleStream() {
  const particlesRef = useRef<Points>(null);

  const particleCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 3 + 2;
      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = Math.random() * 40;
      pos[i3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += 0.2; // 向上移动

        // 重置到底部
        if (positions[i3 + 1] > 40) {
          positions[i3 + 1] = 0;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={TECH_COLORS.material.effects.particle}
        size={0.8}
        transparent
        opacity={0.8}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * 全息显示屏
 */
function HolographicDisplay({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <Plane args={[8, 4]} rotation={[0, 0, 0]}>
        <meshStandardMaterial
          color={TECH_COLORS.material.effects.hologram}
          emissive={TECH_COLORS.material.effects.hologram}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
          side={DoubleSide}
        />
      </Plane>
      <Html center>
        <div
          className="w-64 h-32 bg-black bg-opacity-20 rounded-lg border p-4 text-center"
          style={{
            borderColor: TECH_COLORS.material.effects.hologram,
            color: TECH_COLORS.ui.text.primary,
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          <div className="text-lg font-bold mb-2">NEURAL CORE</div>
          <div className="text-sm">STATUS: ACTIVE</div>
          <div className="text-sm">NODES: 47/50</div>
          <div className="text-sm">THROUGHPUT: 95%</div>
        </div>
      </Html>
    </group>
  );
}

/**
 * 数据节点组件
 */
export function DataNode({
  position,
  type,
  status,
  dataRate,
  connections,
  color,
}: {
  position: [number, number, number];
  type: string;
  status: string;
  dataRate: number;
  connections: number;
  color: string;
}) {
  const nodeRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return TECH_COLORS.status.online;
      case "warning":
        return TECH_COLORS.status.warning;
      case "critical":
        return TECH_COLORS.status.critical;
      case "processing":
        return TECH_COLORS.status.processing;
      default:
        return TECH_COLORS.status.offline;
    }
  };

  const statusColor = getStatusColor(status);
  const nodeSize = type === "core" ? 3 : 2;

  useFrame((state) => {
    if (nodeRef.current) {
      // 根据状态调整动画
      const speed = status === "critical" ? 0.5 : 0.1;
      nodeRef.current.rotation.y = state.clock.getElapsedTime() * speed;

      // 浮动效果
      const float = Math.sin(state.clock.getElapsedTime() * 2) * 0.5;
      nodeRef.current.position.y = position[1] + float;
    }

    if (glowRef.current) {
      // 状态脉冲
      const pulse = Math.sin(state.clock.getElapsedTime() * 3) * 0.3 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={nodeRef} position={position}>
      {/* 主节点 */}
      <Box args={[nodeSize, nodeSize, nodeSize]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </Box>

      {/* 状态光环 */}
      <Torus
        ref={glowRef}
        args={[nodeSize + 0.5, 0.2, 16, 32]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </Torus>

      {/* 数据率指示器 */}
      <DataRateIndicator
        dataRate={dataRate}
        position={[0, nodeSize + 1, 0]}
        color={statusColor}
      />

      {/* 连接数显示 */}
      <Html position={[0, -nodeSize - 2, 0]} center>
        <div
          className="text-xs font-mono text-center px-2 py-1 rounded bg-black bg-opacity-50 border"
          style={{
            color: statusColor,
            borderColor: statusColor,
            minWidth: "60px",
          }}
        >
          <div className="font-bold">{type.toUpperCase()}</div>
          <div>{dataRate}%</div>
          <div>{connections} links</div>
        </div>
      </Html>

      {/* 连接点粒子 */}
      <ConnectionParticles count={connections} radius={nodeSize + 1} />
    </group>
  );
}

/**
 * 数据率指示器
 */
function DataRateIndicator({
  dataRate,
  position,
  color,
}: {
  dataRate: number;
  position: [number, number, number];
  color: string;
}) {
  const barRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (barRef.current) {
      const pulse = Math.sin(state.clock.getElapsedTime() * 4) * 0.1 + 1;
      barRef.current.scale.y = (dataRate / 100) * pulse;
    }
  });

  return (
    <group position={position}>
      <Box ref={barRef} args={[0.5, 2, 0.5]} position={[0, 1, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </Box>
    </group>
  );
}

/**
 * 连接点粒子
 */
function ConnectionParticles({
  count,
  radius,
}: {
  count: number;
  radius: number;
}) {
  const particlesRef = useRef<Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 2;
      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = 0;
      pos[i3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [count, radius]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={TECH_COLORS.primary.neon}
        size={0.3}
        transparent
        opacity={0.8}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * 数据流连接线
 */
export function DataConnections() {
  const { dataConnections } = SITUATION_CONFIG;

  return (
    <group>
      {dataConnections.map((connection, index) => (
        <DataFlowLine
          key={index}
          from={connection.from as [number, number, number]}
          to={connection.to as [number, number, number]}
          bandwidth={connection.bandwidth}
          type={connection.type}
        />
      ))}
    </group>
  );
}

/**
 * 数据流线
 */
function DataFlowLine({
  from,
  to,
  bandwidth,
  type,
}: {
  from: [number, number, number];
  to: [number, number, number];
  bandwidth: number;
  type: string;
}) {
  const lineRef = useRef<Group>(null);

  const lineColor =
    type === "primary" ? TECH_COLORS.primary.neon : TECH_COLORS.primary.cyber;
  const lineWidth = (bandwidth / 100) * 0.2 + 0.1;

  const points = useMemo(() => {
    const fromVec = new Vector3(...from);
    const toVec = new Vector3(...to);
    const mid = fromVec.clone().lerp(toVec, 0.5);
    mid.y += 5; // 弧形效果

    return [fromVec, mid, toVec];
  }, [from, to]);

  useFrame((state) => {
    if (lineRef.current) {
      // 数据流动画
      const flow = (state.clock.getElapsedTime() * 2) % 1;
      lineRef.current.userData = { flow };
    }
  });

  return (
    <group ref={lineRef}>
      <Line
        points={points}
        color={lineColor}
        lineWidth={lineWidth}
        transparent
        opacity={0.8}
      />
      {/* 流动粒子 */}
      <FlowingParticles
        points={points}
        color={lineColor}
        speed={bandwidth / 50}
      />
    </group>
  );
}

/**
 * 流动粒子
 */
function FlowingParticles({
  points,
  color,
  speed,
}: {
  points: Vector3[];
  color: string;
  speed: number;
}) {
  const particlesRef = useRef<Points>(null);
  const particleCount = 20;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current && points.length >= 2) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const t =
          (state.clock.getElapsedTime() * speed + i / particleCount) % 1;

        // 沿着曲线插值
        let position: Vector3;
        if (points.length === 3) {
          // 二次贝塞尔曲线
          const inv = 1 - t;
          position = points[0]
            .clone()
            .multiplyScalar(inv * inv)
            .add(points[1].clone().multiplyScalar(2 * inv * t))
            .add(points[2].clone().multiplyScalar(t * t));
        } else {
          // 线性插值
          position = points[0].clone().lerp(points[1], t);
        }

        positions[i3] = position.x;
        positions[i3 + 1] = position.y;
        positions[i3 + 2] = position.z;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.5}
        transparent
        opacity={0.9}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * 防护屏障
 */
export function ProtectionShields() {
  const { shields } = SITUATION_CONFIG;

  return (
    <group>
      {shields.map((shield, index) => (
        <Shield
          key={index}
          radius={shield.radius}
          height={shield.height}
          opacity={shield.opacity}
          color={shield.color}
          delay={index * 0.5}
        />
      ))}
    </group>
  );
}

/**
 * 单个防护屏障
 */
function Shield({
  radius,
  height,
  opacity,
  color,
  delay,
}: {
  radius: number;
  height: number;
  opacity: number;
  color: string;
  delay: number;
}) {
  const shieldRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (shieldRef.current) {
      // 旋转和脉冲
      shieldRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      const pulse =
        Math.sin(state.clock.getElapsedTime() * 2 + delay) * 0.1 + 1;
      shieldRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <Cylinder
      ref={shieldRef}
      args={[radius, radius, height, 64, 1, true]}
      position={[0, 0, 0]}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.1}
        transparent
        opacity={opacity}
        side={DoubleSide}
        wireframe
      />
    </Cylinder>
  );
}

/**
 * 扫描波系统
 */
export function ScanWaves() {
  const { scanWaves } = SITUATION_CONFIG;

  return (
    <group>
      {scanWaves.map((wave, index) => (
        <ScanWave
          key={index}
          radius={wave.radius}
          speed={wave.speed}
          color={wave.color}
          delay={index * 1.5}
        />
      ))}
    </group>
  );
}

/**
 * 单个扫描波
 */
function ScanWave({
  radius,
  speed,
  color,
  delay,
}: {
  radius: number;
  speed: number;
  color: string;
  delay: number;
}) {
  const waveRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (waveRef.current) {
      const time = state.clock.getElapsedTime() * speed + delay;
      const scale = (Math.sin(time) + 1) * 0.5;
      waveRef.current.scale.setScalar(scale);
      waveRef.current.material.opacity = (1 - scale) * 0.5;
    }
  });

  return (
    <Ring
      ref={waveRef}
      args={[radius - 2, radius, 64]}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.5}
        side={DoubleSide}
      />
    </Ring>
  );
}

/**
 * 环境平台
 */
export function EnvironmentPlatform() {
  return (
    <group>
      {/* 主平台 */}
      <Cylinder args={[80, 80, 1, 64]} position={[0, -5, 0]}>
        <meshStandardMaterial
          color={TECH_COLORS.material.platform.base}
          emissive={TECH_COLORS.material.platform.energy}
          emissiveIntensity={0.05}
          roughness={0.1}
          metalness={0.9}
        />
      </Cylinder>

      {/* 网格线 */}
      <GridLines />

      {/* 边界光环 */}
      <Ring
        args={[78, 80, 64]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -4, 0]}
      >
        <meshStandardMaterial
          color={TECH_COLORS.primary.neon}
          emissive={TECH_COLORS.primary.neon}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          side={DoubleSide}
        />
      </Ring>
    </group>
  );
}

/**
 * 网格线
 */
function GridLines() {
  const gridRef = useRef<Group>(null);

  const gridSize = 80;
  const divisions = 16;
  const step = gridSize / divisions;

  const lines = useMemo(() => {
    const linePoints: Vector3[][] = [];

    // 横线
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      linePoints.push([
        new Vector3(-gridSize / 2, -4.5, i * step),
        new Vector3(gridSize / 2, -4.5, i * step),
      ]);
    }

    // 竖线
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      linePoints.push([
        new Vector3(i * step, -4.5, -gridSize / 2),
        new Vector3(i * step, -4.5, gridSize / 2),
      ]);
    }

    return linePoints;
  }, []);

  useFrame((state) => {
    if (gridRef.current) {
      // 网格脉冲效果
      const pulse = Math.sin(state.clock.getElapsedTime() * 1) * 0.2 + 0.8;
      gridRef.current.children.forEach((child) => {
        if (child.material) {
          child.material.opacity = pulse;
        }
      });
    }
  });

  return (
    <group ref={gridRef}>
      {lines.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={TECH_COLORS.material.platform.grid}
          lineWidth={0.5}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  );
}

/**
 * 主要的3D态势感知场景
 */
export function TechSituationDisplay() {
  const { dataNodes } = SITUATION_CONFIG;

  return (
    <group>
      {/* 环境平台 */}
      <EnvironmentPlatform />

      {/* 中央核心 */}
      <CentralCore />

      {/* 数据节点 */}
      {dataNodes.map((node) => (
        <DataNode
          key={node.id}
          position={node.position}
          type={node.type}
          status={node.status}
          dataRate={node.dataRate}
          connections={node.connections}
          color={node.color}
        />
      ))}

      {/* 数据连接 */}
      <DataConnections />

      {/* 防护屏障 */}
      <ProtectionShields />

      {/* 扫描波 */}
      <ScanWaves />

      {/* 深空星域 */}
      <Stars
        radius={300}
        depth={100}
        count={5000}
        factor={3}
        saturation={0}
        fade
        speed={0.01}
      />

      {/* 环境光效 */}
      <ambientLight
        color={TECH_3D_CONFIG.lighting.ambient.color}
        intensity={TECH_3D_CONFIG.lighting.ambient.intensity}
      />
      <directionalLight
        color={TECH_3D_CONFIG.lighting.directional.color}
        intensity={TECH_3D_CONFIG.lighting.directional.intensity}
        position={TECH_3D_CONFIG.lighting.directional.position}
      />
      <pointLight
        color={TECH_3D_CONFIG.lighting.point.color}
        intensity={TECH_3D_CONFIG.lighting.point.intensity}
        position={TECH_3D_CONFIG.lighting.point.position}
      />

      {/* 雾效 */}
      <fog
        attach="fog"
        args={[
          TECH_3D_CONFIG.environment.fogColor,
          TECH_3D_CONFIG.environment.fogNear,
          TECH_3D_CONFIG.environment.fogFar,
        ]}
      />
    </group>
  );
}

export default TechSituationDisplay;
