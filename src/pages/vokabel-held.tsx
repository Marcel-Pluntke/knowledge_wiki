import {useEffect} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function VokabelHeldRedirect() {
  const target = `${useBaseUrl('/games/lernhelden/')}#/adventure/vocabulary`;
  useEffect(() => { window.location.replace(target); }, [target]);
  return <main><p>Vokabel Held wird in Lernhelden geöffnet …</p></main>;
}
