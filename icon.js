const WEBCAM_PATHS = [
  "M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H9.269c.144.162.33.324.531.475a7 7 0 0 0 .907.57l.014.006.003.002A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.224-.947l.003-.002.014-.007a5 5 0 0 0 .268-.148 7 7 0 0 0 .639-.421c.2-.15.387-.313.531-.475H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z",
  "M8 6.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m7 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"
];

function drawWebcam(ctx, size, fillColor) {
  ctx.save();
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = fillColor;
  ctx.scale(size / 16, size / 16);
  for (const pathData of WEBCAM_PATHS) {
    ctx.fill(new Path2D(pathData));
  }
  ctx.restore();
}

function drawBadgeCircle(ctx, size, fill) {
  const r = size * 0.18;
  const cx = size * 0.78;
  const cy = size * 0.22;
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(1.5, size / 18);
  ctx.stroke();
  ctx.restore();
  return { cx, cy, r };
}

function drawEnabledArrowBadge(ctx, size) {
  const { cx, cy, r } = drawBadgeCircle(ctx, size, '#1b5e20');
  ctx.save();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(1.5, size / 18);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.45, cy + r * 0.3);
  ctx.lineTo(cx + r * 0.28, cy - r * 0.42);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.02, cy - r * 0.42);
  ctx.lineTo(cx + r * 0.28, cy - r * 0.42);
  ctx.lineTo(cx + r * 0.28, cy - r * 0.12);
  ctx.stroke();
  ctx.restore();
}

function drawDisabledBadge(ctx, size) {
  const { cx, cy, r } = drawBadgeCircle(ctx, size, '#5f6368');
  ctx.save();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(1.5, size / 16);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.5, cy + r * 0.5);
  ctx.lineTo(cx + r * 0.5, cy - r * 0.5);
  ctx.stroke();
  ctx.restore();
}

function renderWebcamImageData(size, fillColor, webhookEnabled) {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');
  drawWebcam(ctx, size, fillColor);
  if (webhookEnabled) {
    drawEnabledArrowBadge(ctx, size);
  } else {
    drawDisabledBadge(ctx, size);
  }
  return ctx.getImageData(0, 0, size, size);
}

export async function applyMeetingIcon(atMeeting, webhookEnabled = true) {
  const color = atMeeting ? '#d32f2f' : '#8a8f98';
  const enabled = webhookEnabled !== false;
  const imageData = {
    16: renderWebcamImageData(16, color, enabled),
    32: renderWebcamImageData(32, color, enabled),
    48: renderWebcamImageData(48, color, enabled),
    128: renderWebcamImageData(128, color, enabled),
  };
  await chrome.action.setIcon({ imageData });
}
