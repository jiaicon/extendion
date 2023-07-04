import React, { useEffect, useState, useRef } from 'react';
import { ChromePicker } from 'react-color';
import type { ColorResult } from 'react-color';
import { createRoot } from 'react-dom/client';
import type { Color } from './typings';
import { getCurrentTabId } from './utils';
import styles from './styles.less';

const Index = () => {
  const [value, setValue] = useState<Color>({ r: 241, g: 153, b: 44, a: 1 });
  const popupPort = useRef<chrome.runtime.Port>();

  useEffect(() => {
    popupPort.current = chrome.runtime?.connect({ name: "popup-port" });
    popupPort.current?.onMessage.addListener((message) => {
      console.log(message);
    })
    // gitlab logo
    document.getElementsByClassName('tanuki-logo-container')?.[0]?.setAttribute('style', 'background-color: #000');
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
      className={styles.picker}
    />
  )
}

const root = createRoot(document.getElementById('root')!);
root.render(<Index />);
