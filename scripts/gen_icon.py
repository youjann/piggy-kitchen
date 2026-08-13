#!/usr/bin/env python3
"""生成小猪鼻子应用图标 (180x180 PNG) — 纯标准库,零依赖"""
import struct, zlib, math

W = H = 180

def make_png(pixels, w, h):
    raw = b''
    for y in range(h):
        raw += b'\x00'  # filter type 0
        for x in range(w):
            r, g, b, a = pixels[y][x]
            raw += struct.pack('4B', r, g, b, a)
    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        return c + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    return (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', ihdr)
            + chunk(b'IDAT', zlib.compress(raw, 9))
            + chunk(b'IEND', b''))

def hexc(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

# 颜色
BG      = hexc('F4EEE1')  # 宣纸
HALO    = hexc('F6D9DC')  # 淡粉光晕
NOSE    = hexc('F0A3AE')  # 鼻子主体浅粉
OUTLINE = hexc('D97B8A')  # 轮廓
NOSTRIL = hexc('C95F72')  # 鼻孔深粉
HI1     = hexc('E98A9C')  # 鼻孔内高光
HI2     = hexc('FBC6CE')  # 顶部高光
CHEEK   = hexc('EFB4A0')  # 两颊红晕

def in_ellipse(px, py, cx, cy, rx, ry):
    return ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 <= 1.0

def rounded_rect_mask(x, y, r=40):
    if r <= 0: return True
    if x < r and y < r: return (x - r) ** 2 + (y - r) ** 2 <= r * r
    if x > W - r and y < r: return (x - (W - r)) ** 2 + (y - r) ** 2 <= r * r
    if x < r and y > H - r: return (x - r) ** 2 + (y - (H - r)) ** 2 <= r * r
    if x > W - r and y > H - r: return (x - (W - r)) ** 2 + (y - (H - r)) ** 2 <= r * r
    return True

def blend(base, over, alpha):
    return tuple(round(b * (1 - alpha) + o * alpha) for b, o in zip(base, over))

pixels = [[(0, 0, 0, 0) for _ in range(W)] for _ in range(H)]

for y in range(H):
    for x in range(W):
        if not rounded_rect_mask(x, y):
            continue
        col = BG
        a = 1.0
        # 淡粉光晕
        if (x - 90) ** 2 + (y - 86) ** 2 <= 62 ** 2:
            col = blend(col, HALO, 0.55)
        # 脸颊红晕
        if (x - 38) ** 2 + (y - 112) ** 2 <= 10 ** 2 or (x - 142) ** 2 + (y - 112) ** 2 <= 10 ** 2:
            col = blend(col, CHEEK, 0.55)
        # 鼻子主体 + 轮廓
        if in_ellipse(x, y, 90, 88, 52, 40):
            col = NOSE
            # 描边:距离边缘 3px 内
            def edge(px, py):
                return abs(((px - 90) / 52) ** 2 + ((py - 88) / 40) ** 2 - 1.0)
            # 简单描边:检查是否在轮廓带上
            outer = in_ellipse(x, y, 90, 88, 52, 40)
            outer2 = in_ellipse(x, y, 90, 88, 55.5, 43.5)
            if outer and not outer2:
                col = OUTLINE
        # 鼻孔
        if in_ellipse(x, y, 74, 94, 13, 15) or in_ellipse(x, y, 106, 94, 13, 15):
            col = NOSTRIL
        # 鼻孔高光
        if in_ellipse(x, y, 77, 90, 4.5, 5) or in_ellipse(x, y, 109, 90, 4.5, 5):
            col = HI1
        # 顶部高光
        if in_ellipse(x, y, 78, 62, 18, 7):
            col = blend(col, HI2, 0.9)
        pixels[y][x] = (col[0], col[1], col[2], round(255 * a))

data = make_png(pixels, W, H)
out = '/Users/youjann/WorkBuddy/工作台/piggy-kitchen/public/app-icon.png'
with open(out, 'wb') as f:
    f.write(data)
print('written', out, len(data), 'bytes')
