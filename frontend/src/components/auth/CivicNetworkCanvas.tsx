import React, { useEffect, useRef, useState } from 'react';

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  type: 'sensor' | 'hub' | 'pipeline' | 'alert';
  pulsePhase: number;
  label?: string;
}

interface PulsePacket {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

interface RadarRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface CivicNetworkCanvasProps {
  theme: 'light' | 'dark';
}

export const CivicNetworkCanvas: React.FC<CivicNetworkCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const ripplesRef = useRef<RadarRipple[]>([]);
  const [activeNodesCount, setActiveNodesCount] = useState(48);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    // Initialize Network Nodes
    const nodeCount = Math.min(65, Math.max(35, Math.floor((width * height) / 25000)));
    setActiveNodesCount(nodeCount);

    let nodes: NodePoint[] = [];
    let packets: PulsePacket[] = [];

    const nodeTypes: ('sensor' | 'hub' | 'pipeline' | 'alert')[] = ['sensor', 'hub', 'pipeline', 'sensor', 'sensor'];
    const sampleLabels = ['NODE-12', 'DRAIN-04', 'ROAD-9B', 'PUMP-02', 'LIGHT-88', 'SENSOR-15'];

    function initNodes() {
      nodes = [];
      packets = [];
      for (let i = 0; i < nodeCount; i++) {
        const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
        const isHub = type === 'hub' || i % 7 === 0;
        const baseRadius = isHub ? 3.5 + Math.random() * 2 : 2 + Math.random() * 1.5;
        
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: baseRadius,
          baseRadius,
          type: isHub ? 'hub' : type,
          pulsePhase: Math.random() * Math.PI * 2,
          label: isHub ? sampleLabels[i % sampleLabels.length] : undefined
        });
      }
    }

    initNodes();

    // Mouse Event Handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Spawn radar ping ripple
      ripplesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.45,
        alpha: 0.8
      });

      // Spawn packets from closest node
      let closestIdx = -1;
      let minDst = Infinity;
      nodes.forEach((node, idx) => {
        const d = Math.hypot(node.x - clickX, node.y - clickY);
        if (d < minDst) {
          minDst = d;
          closestIdx = idx;
        }
      });

      if (closestIdx !== -1 && minDst < 250) {
        // Send signal pulses to neighbors
        nodes.forEach((target, targetIdx) => {
          if (targetIdx !== closestIdx) {
            const dist = Math.hypot(nodes[closestIdx].x - target.x, nodes[closestIdx].y - target.y);
            if (dist < 180) {
              packets.push({
                fromNode: closestIdx,
                toNode: targetIdx,
                progress: 0,
                speed: 0.025 + Math.random() * 0.02
              });
            }
          }
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Periodically generate telemetry signal packets between random close nodes
    const packetInterval = setInterval(() => {
      if (nodes.length < 2) return;
      const srcIdx = Math.floor(Math.random() * nodes.length);
      // find nearest neighbor
      let bestTarget = -1;
      let bestDist = 180;
      nodes.forEach((n, idx) => {
        if (idx !== srcIdx) {
          const d = Math.hypot(nodes[srcIdx].x - n.x, nodes[srcIdx].y - n.y);
          if (d < bestDist) {
            bestDist = d;
            bestTarget = idx;
          }
        }
      });

      if (bestTarget !== -1 && packets.length < 15) {
        packets.push({
          fromNode: srcIdx,
          toNode: bestTarget,
          progress: 0,
          speed: 0.015 + Math.random() * 0.02
        });
      }
    }, 1200);

    // Animation Loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      
      // Color schemes based on dark/light
      const nodeColorHub = isDark ? '#38bdf8' : '#0284c7';
      const nodeColorSensor = isDark ? '#60a5fa' : '#2563eb';
      const nodeColorAlert = isDark ? '#f59e0b' : '#d97706';
      const linkColor = isDark ? 'rgba(56, 189, 248, ' : 'rgba(37, 99, 235, ';
      const mouseLineColor = isDark ? 'rgba(96, 165, 250, ' : 'rgba(14, 165, 233, ';
      const rippleStroke = isDark ? 'rgba(56, 189, 248, ' : 'rgba(37, 99, 235, ';

      // 1. Draw subtle background coordinate grid
      ctx.strokeStyle = isDark ? 'rgba(38, 52, 73, 0.25)' : 'rgba(226, 232, 240, 0.6)';
      ctx.lineWidth = 0.5;
      const gridSize = 64;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Update and draw radar ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const ripple = ripplesRef.current[i];
        ripple.radius += dt * 320;
        ripple.alpha = Math.max(0, 0.8 * (1 - ripple.radius / ripple.maxRadius));

        if (ripple.radius >= ripple.maxRadius || ripple.alpha <= 0.01) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `${rippleStroke}${ripple.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner harmonic ring
        if (ripple.radius > 30) {
          ctx.strokeStyle = `${rippleStroke}${ripple.alpha * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Update Node positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce on boundary
        if (node.x < 10) { node.x = 10; node.vx *= -1; }
        if (node.x > width - 10) { node.x = width - 10; node.vx *= -1; }
        if (node.y < 10) { node.y = 10; node.vy *= -1; }
        if (node.y > height - 10) { node.y = height - 10; node.vy *= -1; }

        // Mouse gentle interaction (magnetic or subtle push)
        if (mouseRef.current.active) {
          const dx = node.x - mouseRef.current.x;
          const dy = node.y - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 180;
          if (dist < maxDist && dist > 1) {
            // Soft spring repulsion
            const force = (1 - dist / maxDist) * 0.6;
            node.x += (dx / dist) * force;
            node.y += (dy / dist) * force;
          }
        }

        // Pulse phase
        node.pulsePhase += dt * 2;
      });

      // 4. Draw Inter-node Links
      const maxLinkDist = 150;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxLinkDist) {
            const opacity = (1 - dist / maxLinkDist) * (isDark ? 0.28 : 0.22);
            ctx.strokeStyle = `${linkColor}${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        // Mouse dynamic vector lines
        if (mouseRef.current.active) {
          const mdx = nodes[i].x - mouseRef.current.x;
          const mdy = nodes[i].y - mouseRef.current.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < 160) {
            const mOpacity = (1 - mdist / 160) * (isDark ? 0.45 : 0.35);
            ctx.strokeStyle = `${mouseLineColor}${mOpacity})`;
            ctx.lineWidth = 1.2;
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
            ctx.lineTo(nodes[i].x, nodes[i].y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // 5. Draw and update Signal Packets
      for (let p = packets.length - 1; p >= 0; p--) {
        const packet = packets[p];
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const n1 = nodes[packet.fromNode];
        const n2 = nodes[packet.toNode];
        if (!n1 || !n2) continue;

        const px = n1.x + (n2.x - n1.x) * packet.progress;
        const py = n1.y + (n2.y - n1.y) * packet.progress;

        ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Little glow
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.3)';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Draw Nodes
      nodes.forEach(node => {
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const currentRadius = node.baseRadius + (node.type === 'hub' ? pulse * 1.5 : 0);

        // Outer glow halo for Hubs
        if (node.type === 'hub') {
          ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.25)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius + 5 + pulse * 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Main node circle
        ctx.fillStyle = node.type === 'hub' ? nodeColorHub : node.type === 'alert' ? nodeColorAlert : nodeColorSensor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Center white core
        ctx.fillStyle = isDark ? '#ffffff' : '#f8fafc';
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Technical node label
        if (node.label && width > 768) {
          ctx.font = '9px monospace';
          ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.65)' : 'rgba(100, 116, 139, 0.8)';
          ctx.fillText(node.label, node.x + 8, node.y + 3);
        }
      });

      // 7. Mouse cursor beacon if active
      if (mouseRef.current.active) {
        ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.5)' : 'rgba(37, 99, 235, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#38bdf8' : '#2563eb';
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(packetInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [theme]);

  // Ping infrastructure manually (e.g. from an interactive button)
  const triggerManualPing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ripplesRef.current.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 0,
      maxRadius: Math.max(canvas.width, canvas.height) * 0.6,
      alpha: 0.9
    });
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-auto z-0"
        style={{ touchAction: 'none' }}
      />
      {/* Subtle Interactive Instruction Pill */}
      <div className="fixed bottom-3 left-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 shadow-sm pointer-events-auto">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Interactive Civic Sensor Network ({activeNodesCount} nodes)</span>
        <span className="text-slate-300 dark:text-slate-700">·</span>
        <button
          onClick={triggerManualPing}
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
        >
          Click screen or Tap here to Ping Radar
        </button>
      </div>
    </>
  );
};
