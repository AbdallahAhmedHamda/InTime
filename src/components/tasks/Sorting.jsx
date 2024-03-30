import { useDispatch, useSelector } from 'react-redux'
import { setSorting } from '../../features/navigation/navigationSlice'
import Select from 'react-select'

const sortingOptions = [
  {
    value: 'alphabetically',
    label: 'Alphabetically'
  },
  {
    value: 'priority',
    label: 'Priority'
  },
  {
    value: 'totalSteps',
    label: 'Total steps'
  },
  {
    value: 'dateAdded',
    label: 'Date added'
  },
  {
    value: 'startDate',
    label: 'Start date'
  },
  {
    value: 'endDate',
    label: 'End date'
  }
]

const sortingOrder = [
  {
    value: 'ascending',
    label: 'Ascending'
  },
  {
    value: 'descending',
    label: 'Descending'
  }
]

export default function Sorting() {
  const sorting = useSelector((state) => state.navigation.sorting)

  const dispatch = useDispatch()

  return (
    <div className='tasks-sorting-container'>
      <Select
        isSearchable={false}
        options={sortingOptions}
        classNames={{
          option: () =>
            'task-sort-option'
        }}
        styles={{
          container: (base) => ({ ...base, minWidth: 135}),
          menuPortal: (base) => ({ ...base, zIndex: 20}),
          menuList: (base) => ({ ...base, paddingBlock: 0}),
          singleValue: (base) => ({
            ...base,
            color: '#23235F',
          }),
          option: (base, state) => ({
            ...base,
            cursor: 'pointer',
            fontFamily: 'Roboto',
            fontWeight: 500,
            color: state.isSelected ? 'white' : '#23235F',
          })
        }}
        menuPortalTarget={document.body}
        menuShouldScrollIntoView={false}
        menuPosition='fixed'
        value={sortingOptions.find((type) => type.value === sorting.type)}
        onChange={(type) =>
          dispatch(setSorting({
            ...sorting,
            type: type.value
          }))
        }
      >
      </Select>

      <Select
        isSearchable={false}
        options={sortingOrder}
        classNames={{
          option: () =>
            'task-sort-option'
        }}
        styles={{
          container: (base) => ({ ...base, minWidth: 135}),
          menuPortal: (base) => ({ ...base, zIndex: 20}),
          menuList: (base) => ({ ...base, paddingBlock: 0}),
          singleValue: (base) => ({
            ...base,
            color: '#23235F',
          }),
          option: (base, state) => ({
            ...base,
            cursor: 'pointer',
            fontFamily: 'Roboto',
            fontWeight: 500,
            color: state.isSelected ? 'white' : '#23235F',
          })
        }}
        menuPortalTarget={document.body}
        menuShouldScrollIntoView={false}
        menuPosition='fixed'
        value={sortingOrder.find((order) => order.value === sorting.order)}
        onChange={(order) =>
          dispatch(setSorting({
            ...sorting,
            order: order.value
          }))
        }
      >
      </Select>
    </div>
  )
}