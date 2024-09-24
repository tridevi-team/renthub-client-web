import { breadcrumbConfig } from '@app/config/breadcrumb.config';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
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
    const parts = path.split('/').filter(Boolean);
    const breadcrumbs = [];
    let currentPath = '';

    if (parts.length === 0) {
      breadcrumbs.push({
        path: currentPath,
        label: t(breadcrumbConfig['/'].label),
        isLast: true,
      });
    }

    for (let i = 0; i < parts.length; i++) {
      currentPath += `/${parts[i]}`;
      let configKey = currentPath;

      // Check if the current part is likely a dynamic segment (e.g., an ID)
      if (/^\d+$/.test(parts[i])) {
        configKey = currentPath.replace(/\/\d+/, '/:id');
      }

      const config = breadcrumbConfig[configKey];

      if (config) {
        breadcrumbs.push({
          path: currentPath,
          label: t(config.label),
          isLast: i === parts.length - 1,
        });
      }
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
                <Link href={crumb.path}>{crumb.label}</Link>
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
