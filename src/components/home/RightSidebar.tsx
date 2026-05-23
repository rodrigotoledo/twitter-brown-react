import { POST_FILTER_OPTIONS } from '../../utils/postFilters'
import type { PostFilter } from '../../types/post'

type Props = {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  activeFilter: PostFilter
  onFilterChange: (filter: PostFilter) => void
  filterCounts: Record<PostFilter, number>
}

const inputClass =
  'w-full border border-cursor-border bg-cursor-light text-cursor-foreground px-3 py-2 rounded-full outline-none focus:outline focus:outline-2 focus:outline-cursor-focus text-sm'

const RightSidebar = ({
  searchQuery,
  onSearchChange,
  onSearch,
  activeFilter,
  onFilterChange,
  filterCounts,
}: Props) => (
  <aside className="hidden xl:block fixed right-0 top-0 z-20 h-screen w-80 px-4 py-4 border-l border-cursor-border bg-cursor-light overflow-y-auto">
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="search"
          placeholder="Search posts"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className={inputClass}
        />
        <button
          type="button"
          onClick={onSearch}
          className="shrink-0 bg-cursor-accent text-cursor-on-accent font-semibold px-4 py-2 rounded-full hover:bg-cursor-accent-hover transition text-sm"
        >
          Search
        </button>
      </div>

      <div className="bg-cursor-dark rounded-2xl border border-cursor-border overflow-hidden">
        <h2 className="font-bold text-lg px-4 py-3 border-b border-cursor-border">
          Posts
        </h2>
        <div className="flex flex-col">
          {POST_FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange(value)}
              className={`flex items-center justify-between gap-3 px-4 py-3 text-left text-sm transition hover:bg-cursor ${
                activeFilter === value
                  ? 'font-semibold bg-cursor text-cursor-foreground'
                  : 'text-cursor-muted'
              }`}
            >
              <span>{label}</span>
              <span className="tabular-nums">{filterCounts[value]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </aside>
)

export default RightSidebar
