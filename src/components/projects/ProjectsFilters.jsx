import Select from 'react-select'

const filters = [
  {
    value: '',
    label: 'All'
  },
  {
    value: 'admin',
    label: 'Admin'
  },
  {
    value: 'user',
    label: 'Member'
  }
]

export default function ProjectsFilters({ role, setRole }) {
  return (
    <div className='projects-filters-container'>
      <Select
        defaultValue={filters[0]}
        isSearchable={false}
        options={filters}
        classNames={{
          option: () =>
            'projects-filter-option'
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
        value={filters.find((filter) => filter.value === role)}
        onChange={(filter) =>
          setRole(filter.value)
        }
      >
      </Select>
    </div>
  )
}