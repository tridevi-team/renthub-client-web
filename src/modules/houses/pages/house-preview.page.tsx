import img1 from '@assets/3d-view/sample1.jpg';
import img2 from '@assets/3d-view/sample2.jpg';
import img3 from '@assets/3d-view/sample3.jpg';
import img4 from '@assets/3d-view/sample4.jpg';
import { authPath } from '@modules/auth/routes';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser } from '@shared/utils/checker.util';
import { useEffect, useRef } from 'react';
import { type LoaderFunction, redirect, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();

  if (!authed) {
    toast.error(errorLocale.LOGIN_REQUIRED);
    return redirect(authPath.login);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();
  const location = useLocation();
  const pathname = location.pathname;
  const viewerRef = useRef<HTMLDivElement>(null);
  const caption = 'Phòng trọ cao cấp tại Hà Nội';

  const nodes = [
    {
      id: '1',
      panorama: img1,
      name: 'One',
      caption: `[1] ${caption}`,
      links: [{ nodeId: '2' }, { nodeId: '3' }],
      gps: [-80.156479, 25.666725, 3],
      sphereCorrection: { pan: '33deg' },
    },
    {
      id: '2',
      panorama: img2,
      name: 'Two',
      caption: `[2] ${caption}`,
      links: [{ nodeId: '3' }],
      gps: [-80.156168, 25.666623, 3],
      sphereCorrection: { pan: '42deg' },
    },
    {
      id: '3',
      panorama: img3,
      name: 'Three',
      caption: `[3] ${caption}`,
      links: [{ nodeId: '4' }, { nodeId: '2' }],
      gps: [-80.155932, 25.666498, 5],
      sphereCorrection: { pan: '50deg' },
    },
    {
      id: '4',
      panorama: img4,
      name: 'Four',
      caption: `[4] ${caption}`,
      links: [{ nodeId: '3' }],
      gps: [-80.155732, 25.666366, 5],
      sphereCorrection: { pan: '60deg' },
    },
    {
      id: '5',
      panorama: img1,
      name: 'Five',
      caption: `[5] ${caption}`,
      links: [{ nodeId: '3' }],
      gps: [-80.155732, 25.666366, 5],
      sphereCorrection: { pan: '60deg' },
    },
  ];

  useEffect(() => {
    if (viewerRef.current) {
      const viewer = new Viewer({
        container: viewerRef.current,
        touchmoveTwoFingers: true,
        mousewheelCtrlKey: true,
        defaultYaw: '130deg',
        navbar: 'zoom move gallery caption fullscreen',

        plugins: [
          [
            VirtualTourPlugin,
            {
              positionMode: 'gps',
              renderMode: '3d',
              nodes: nodes,
              startNodeId: '2',
            },
          ],
        ],
      });

      return () => {
        viewer.destroy();
      };
    }
  }, []);
  return (
    <ContentLayout title={t('house_preview_title')} pathname={pathname}>
      <div ref={viewerRef} style={{ height: '100vh' }} />
    </ContentLayout>
  );
}
