import React, { useEffect, useState, useRef } from 'react';
import { ChromePicker } from 'react-color';
import type { ColorResult } from 'react-color';
import { createRoot } from 'react-dom/client';
import type { Color } from './typing';
import { getCurrentTabId } from './utils';

// const presetColors = ['#ff4d4f', '#ff7a45', '#ffc53d', '#ffec3d', '#bae637', '#73d13d', '#36cfc9', '#4096ff', '#597ef7', '#9254de'];

const Index = () => {
  const [value, setValue] = useState<Color>({ r: 241, g: 153, b: 44, a: 1 });
  const popupPort = useRef<chrome.runtime.Port>();

  useEffect(() => {
    popupPort.current = chrome.runtime.connect({ name: "popup-port" });
    popupPort.current.onMessage.addListener((message) => {
      console.log(message);
    })
    return () => {
      popupPort.current?.disconnect();
    }
  }, [])
  useEffect(() => {
    document.body.style.backgroundColor = `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a || 1})`;
  }, [value])

  const handleChange = async (color: ColorResult) => {
    await setValue(color.rgb);
    const tabId = await getCurrentTabId();
    await popupPort.current?.postMessage({ tabId, value: color.rgb });
  }
  return (
    <ChromePicker
      color={value}
      onChange={handleChange}
    />
  )
}

const root = createRoot(document.getElementById('root')!);
root.render(<Index />);
