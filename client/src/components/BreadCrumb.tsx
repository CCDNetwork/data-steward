import React from 'react';
import { Link } from 'react-router-dom';

import { IBreadCrumb } from '@/helpers/types';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

interface Props {
  breadcrumbs: IBreadCrumb[];
}

export const BreadCrumb = ({ breadcrumbs }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
        {breadcrumbs.map((breadcrumb: IBreadCrumb, index: number) => {
          const isLastPath = breadcrumbs.length === index + 1;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {!isLastPath && breadcrumb.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={breadcrumb.href}>{breadcrumb.name}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="font-medium">{breadcrumb.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {breadcrumbs.length !== index + 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
