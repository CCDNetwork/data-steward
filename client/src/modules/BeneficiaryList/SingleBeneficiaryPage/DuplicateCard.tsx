import { formatDate } from 'date-fns';
import { getBeneficiaryStatus, renameMathedFields } from '../helpers';
import { SingleBeneficiary } from '../types';
import { cn } from '@/helpers/utils';

interface Props {
  item: SingleBeneficiary;
  beneficiaryMatchedFields?: string[];
  evenItem?: boolean;
}

export const DuplicateCard = ({
  item,
  beneficiaryMatchedFields,
  evenItem,
}: Props) => {
  return (
    <>
      <dl
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 gap-6 p-2',
          evenItem && 'sm:bg-muted/40',
        )}
      >
        {item.organization && (
          <div
            className={cn('sm:col-span-2', !item.isPrimary && 'sm:col-span-1')}
          >
            <dt className="text-sm font-bold tracking-tight leading-6">
              Organization
            </dt>
            <dd className="mt-1 text-sm leading sm:mt-2">
              {item.organization.name}
            </dd>
          </div>
        )}
        {item.status && !item.isPrimary && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-bold tracking-tight leading-6">
              Duplication status
            </dt>
            <dd className="mt-1 text-sm leading sm:mt-2">
              {getBeneficiaryStatus(item.status)}
            </dd>
          </div>
        )}
        {item.updatedAt && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-bold tracking-tight leading-6">
              Upload date
            </dt>
            <dd className="mt-1 text-sm leading sm:mt-2">
              {formatDate(item.updatedAt, 'dd/MM/yyyy HH:mm')}
            </dd>
          </div>
        )}
        {item.uploadedBy && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-bold tracking-tight leading-6">
              Uploaded by
            </dt>
            <dd className="mt-1 text-sm leading sm:mt-2">
              {item.uploadedBy.firstName} {item.uploadedBy.lastName}
            </dd>
          </div>
        )}

        {/* data from beneficiary (isPrimary) */}
        {beneficiaryMatchedFields && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-bold tracking-tight leading-6">
              Potential duplicate fields
            </dt>
            <dd className="mt-1 text-sm leading sm:mt-2">
              {beneficiaryMatchedFields
                .map((el) => renameMathedFields(el))
                .join(', ')}
            </dd>
          </div>
        )}

        {/* data from duplicate item */}
        {item.matchedFields.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-bold tracking-tight leading-6">
              Potential duplicate fields
            </dt>
            <dd className="mt-1 text-sm leading sm:mt-2">
              {item.matchedFields
                .map((el) => renameMathedFields(el))
                .join(', ')}
            </dd>
          </div>
        )}
      </dl>
    </>
  );
};
