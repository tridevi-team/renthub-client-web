import { breadcrumbConfig } from '@app/config/breadcrumb.config';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@shared/components/ui/breadcrumbs';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Home } from 'lucide-react'; // Add this import
import type React from 'react';
import { Link } from 'react-aria-components';

interface BreadcrumbsProps {
  pathname: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pathname }) => {
  const [t] = useI18n();

  const getBreadcrumbs = (path: string) => {
    const segments = path === '/' ? [''] : path.split('/').filter(Boolean);
    const breadcrumbs = [];
    let currentConfig = breadcrumbConfig;
    let currentPath = '';

    for (const segment of segments) {
      let matchedSegment = Object.keys(currentConfig).find(
        (key) => key === `/${segment}`,
      );

      if (!matchedSegment) {
        matchedSegment = Object.keys(currentConfig).find((key) => {
          if (!key.startsWith('/:')) return false;

          const remainingConfigPath = key.split('/').slice(2).join('/');
          const remainingCurrentPath = segments
            .slice(segments.indexOf(segment) + 1)
            .join('/');

          return remainingConfigPath === remainingCurrentPath;
        });
      }

      if (!matchedSegment && segment !== '') {
        break;
      }

      const actualPath = matchedSegment || '';
      currentPath += actualPath.replace(/\/:(\w+)/g, `/${segment}`);
      const { label, children } = currentConfig[actualPath];
      breadcrumbs.push({
        path: currentPath || '/',
        label: t(label),
        isLast: false,
      });

      currentConfig = children || {};
    }

    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isLast = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center">
              <Home className="h-4 w-4" />
              {breadcrumbs?.length > 0 && (
                <BreadcrumbSeparator className="mt-0.5 ml-2" />
              )}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb, _) => (
          <BreadcrumbItem key={crumb.path}>
            <BreadcrumbLink asChild>
              {crumb.isLast ? (
                <b>{crumb.label}</b>
              ) : (
                <Link href={crumb.path} className="flex items-center">
                  {crumb.label}
                  <BreadcrumbSeparator className="mt-0.5 ml-2" />
                </Link>
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
