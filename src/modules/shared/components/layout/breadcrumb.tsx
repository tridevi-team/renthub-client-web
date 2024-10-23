import { breadcrumbConfig } from '@app/config/breadcrumb.config';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@shared/components/ui/breadcrumbs';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
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
      const matchedSegment = Object.keys(currentConfig).find((key) => {
        if (key.startsWith('/:')) {
          return true;
        }
        return key === `/${segment}` || key === '';
      });

      if (!matchedSegment) {
        break;
      }

      currentPath += matchedSegment.replace(/\/:(\w+)/g, `/${segment}`);
      const { label, children } = currentConfig[matchedSegment];
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
        {breadcrumbs.map((crumb, _) => (
          <BreadcrumbItem key={crumb.path}>
            <BreadcrumbLink asChild>
              {crumb.isLast ? (
                <span>{crumb.label}</span>
              ) : (
                <Link href={crumb.path}>
                  {crumb.label}
                  <BreadcrumbSeparator />
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
