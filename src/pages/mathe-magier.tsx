import {useEffect} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function MatheMagierRedirect() {
  const target = `${useBaseUrl('/games/lernhelden/')}#/adventure/fractions`;
  useEffect(() => { window.location.replace(target); }, [target]);
  return <main><p>Mathe Magier wird in Lernhelden geöffnet …</p></main>;
}
