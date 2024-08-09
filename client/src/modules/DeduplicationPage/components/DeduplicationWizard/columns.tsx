import { TableColumn } from '@/components/DataTable/types';
import { Beneficiary } from '@/services/beneficiaryList';

export const columns: TableColumn<Beneficiary>[] = [
  {
    accessorKey: 'firstName',
    id: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'familyName',
    id: 'familyName',
    header: 'Family name',
  },
  {
    accessorKey: 'gender',
    id: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'dateOfBirth',
    id: 'dateOfBirth',
    header: 'Date of birth',
  },
  {
    accessorKey: 'hhId',
    id: 'hhId',
    header: 'Household ID',
  },
  {
    accessorKey: 'mobilePhoneId',
    id: 'mobilePhoneId',
    header: 'Mobile phone ID',
  },
  {
    accessorKey: 'govIdType',
    id: 'govIdType',
    header: 'Gov ID type',
  },
  {
    accessorKey: 'govIdNumber',
    id: 'govIdNumber',
    header: 'Gov ID number',
  },
  {
    accessorKey: 'otherIdType',
    id: 'otherIdType',
    header: 'Other ID type',
  },
  {
    accessorKey: 'otherIdNumber',
    id: 'otherIdNumber',
    header: 'Other ID number',
  },
  {
    accessorKey: 'assistanceDetails',
    id: 'assistanceDetails',
    header: 'Assistance details',
  },
  {
    accessorKey: 'activity',
    id: 'activity',
    header: 'Activity',
  },
  {
    accessorKey: 'currency',
    id: 'currency',
    header: 'Currency',
  },
  {
    accessorKey: 'currencyAmount',
    id: 'currencyAmount',
    header: 'Currency amount',
  },
  {
    accessorKey: 'startDate',
    id: 'startDate',
    header: 'Start date',
  },
  {
    accessorKey: 'endDate',
    id: 'endDate',
    header: 'End date',
  },
  {
    accessorKey: 'frequency',
    id: 'frequency',
    header: 'Frequency',
  },
];
