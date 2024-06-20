import Select from 'react-select'

const sortingOptions = [
  {
    value: 'name',
    label: 'Alphabetically'
  },
  {
    value: 'priority',
    label: 'Priority'
  },
  {
    value: 'createdAt',
    label: 'Date added'
  },
  {
    value: 'startAt',
    label: 'Start date'
  },
  {
    value: 'endAt',
    label: 'End date'
  }
]

const sortingOrder = [
  {
    value: '1',
    label: 'Ascending'
  },
  {
    value: '-1',
    label: 'Descending'
  }
]

export default function Sorting({ sorting, setSorting }) {
  return (
    <div className='tasks-sorting-container'>
      <Select
        defaultValue={sortingOptions[2]}
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
        value={sortingOptions.find((sortBy) => sortBy.value === sorting.sortBy)}
        onChange={(sortBy) =>
          setSorting({
            ...sorting,
            sortBy: sortBy.value
          })
        }
      >
      </Select>

      <Select
        defaultValue={sortingOrder[1]}
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
        value={sortingOrder.find((sortingType) => sortingType.value === sorting.sortingType)}
        onChange={(sortingType) =>
          setSorting({
            ...sorting,
            sortingType: sortingType.value
          })
        }
      >
      </Select>
    </div>
  )
}