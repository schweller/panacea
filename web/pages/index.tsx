import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtual } from 'react-virtual'
import { useMemo, useRef, useState } from "react"
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { Link2Icon, ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons"

import SelectDemo from "../components/select"
import { Box, Flex, Text, StyledButton, Anchor, Heading, Paragraph } from "../components/common"
import { loadGames, loadEvents, loadLanguages, Game, Event as EventType, Language } from "../lib/load-data"
import { styled } from "../stitches.config"

const ldRootUrl = "https://ldjam.com"

const StyledSeparator = styled(SeparatorPrimitive.Root, {
  backgroundColor: '$plum10',
  '&[data-orientation=horizontal]': { height: 1, width: '100%' },
  '&[data-orientation=vertical]': { height: '100%', width: 1 },
});

const PillLink = styled('a', {
    display: 'flex',
    color: '$mauve12',
    width: 88,
    height: 30,
    fontWeight: 700,
    fontSize: 12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    background: '$amber1',
    border: '1px solid black',
    borderColor: '$plum10',
    borderRadius: 20,
    textDecoration: 'none',
    '&:hover': {
        background: '$plum4'
    }
})

const Tag = styled('div', {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    border: "1px solid black",
    padding: '0 15px',
    fontSize: 12,
    lineHeight: 1,
    fontWeight: 700,
    height: 20,
  
    variants: {
      variant: {
        violet: {
          color: '$sand12',
          backgroundColor: '$amber4',
          borderColor: '$amber10',
        },
        plum: {
          color: '$mauve12',
          backgroundColor: '$plum4',
          borderColor: '$plum10',
        }
      },
    },
  
    defaultVariants: {
      variant: 'plum',
    },
});

const Table = styled('table', {
    borderSpacing: 0,
    width: '100%',
    tableLayout: 'fixed'
})

const TableHeading = styled('th', {
    width: 60,
    padding: 10,
    backgroundColor: '$plum7',
    textAlign: 'left',
    color: '$plum12',
    '&:first-child': {
        borderTopLeftRadius: 10,
    },
    '&:last-child': {
        borderTopRightRadius: 10,
    },
})

const TableRow = styled('tr', {
    border: '1px solid',
    borderColor: '$plum10',
    '&:hover': {
        background: '$plum3'
    },
    '&:last-child > td': {
        borderBottom: 'none',
    },
})

const TableCell = styled('td', {
    padding: 10,
    borderBottom: '1px solid',
    borderBottomColor: '$plum10'
})

type HomeProps = {
  games: Game[],
  events: EventType[],
  languages: Language[]
}

export const getStaticProps: GetStaticProps<HomeProps> = async (context) => {
  const games = await loadGames()
  const events = await loadEvents()
  const languages = await loadLanguages()

  return {
    props: {
      games,
      events,
      languages
    }
  }
}

const renderSubComponent = ({ row }: { row: Row<Game> }) => {
  return (
    <pre style={{ fontSize: '10px' }}>
      <code>{JSON.stringify(row.original, null, 2)}</code>
    </pre>
  )
}

const Home = ({games, events, languages}: InferGetStaticPropsType<typeof getStaticProps>) => {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [languageFilter, setLanguageFilter] = useState('')
  const [eventFilter, setEventFilter] = useState('')

  const defaultColumns = useMemo<ColumnDef<Game>[]>(
      () => [
          {
            id: 'expander',
            header: () => null,
            cell: ({ row }) => {
             return row.getCanExpand() ? (
                <button
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: 'pointer', border: 'none', background: 'none', fontSize: 24 },
                  }}
                >
                  {row.getIsExpanded() ? '👇' : '👉'}
                </button>
              ) : (
                '🔵'
              )
            },
            size: 10
          },
          {
            accessorKey: 'Name',
            header: 'Name',
            cell: (data) => {
                const link = data.row.getValue('Link') as string
                return (
                  <>
                    <Anchor href={link} target="_blank" title={link} variant="dotted">
                      <Flex css={{alignItems: 'center'}}>
                        <Box css={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '80%', marginRight: 10}}>
                          {data.getValue()}
                        </Box> 
                        <Link2Icon/>
                      </Flex>
                    </Anchor>
                  </>
                )
            }
          },
          {
              accessorFn: (row, i) => {
                  return `${ldRootUrl}${row.Path}`
              },
              cell: (data) => {
                  return <PillLink target="_blank" href={data.getValue() as string}>Game Link</PillLink>
              },
              header: 'Link',
              size: 80,
          },
          {
              accessorFn: (row, i) => {
                  const languagesList = languages.find(x => x.Id === row.Id)?.Languages[0]
                  return languagesList
              },
              cell: (data) => {
                  const list = data.getValue() as Object
                  return !list ? 
                      null :
                      <Flex css={{flexWrap: 'wrap', gap: '10px'}}>
                          {Object.keys(list).map((key, i) => (
                              <Tag key={`${key}-${i}`}>{key}</Tag>
                          ))}
                      </Flex>
              },
              size: 100,
              header: 'Made with',
              enableColumnFilter: true,
              filterFn: (row, columnId, value: string) => {
                  const kv = row.getValue(columnId) as any
                  if (kv) {
                      if (kv[value] as any  ) {
                          return true
                      } else {
                          return false
                      }
                  } else {
                      return false
                  }
              }
          },
          {
              accessorFn: (row) => {
                  const event = events.find(x => {
                      return x.Id === row.parent
                  })
                  return event?.Name
              },
              enableColumnFilter: true,
              filterFn: (row, columnId, value) => {
                  const eventNameRow = row.getValue(columnId)
                  if (value === eventNameRow) {
                      return true
                  } else {
                      return false
                  }
              },
              header: 'Event',
              cell: (data) => {
                  return <>{ data.getValue()}</>
              },
              size: 60
          },
          {
              accessorFn: (row) => {
                  const grade = row.Magic["grade-01-result"]
                  return grade
              },
              header: 'Grade',
              cell: (data) => {
                  return <>{ data.getValue()}th</>
              },
              size: 60             
          }
      ],
      [] 
  ) 

  // languages and engines filters
  let filterValues:string[] = []
  languages.forEach((obj) => {
      const innerLang = obj.Languages[0]
      Object.keys(innerLang).forEach((key) => {
          if (filterValues.indexOf(key) === -1) {
              filterValues = [key, ...filterValues]
          }
      })
  })

  // ludum dare event filters
  let eventFilterValues:string[] = []
  events.forEach((obj) => {
      if (obj.Name !== 'Ludum Dare Test') eventFilterValues = [obj.Name, ...eventFilterValues]
  })

  // Sort alphabetically
  eventFilterValues = eventFilterValues.sort((a, b) => a.localeCompare(b))

  const table = useReactTable({
      data: games,
      columns: defaultColumns,
      enableColumnFilters: true,
      state: {
          columnFilters,
          columnVisibility: {
            "Link": false
          }
      },
      getRowCanExpand: () => true,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      debugTable: true,
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)
  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 100,
  })

  const { virtualItems: virtualRows, totalSize } = rowVirtualizer
  const madeWithColumn = table.getColumn("Made with")
  const eventColumn = table.getColumn("Event")

  const handleSelectChange = (value: string) => {
      madeWithColumn.setFilterValue(value)
      setLanguageFilter(value)
  };

  const handleEventSelectChange = (value: string) => {
      eventColumn.setFilterValue(value)
      setEventFilter(value)
  }

  const handleResetFilters = () => {
      table.resetColumnFilters()
      setLanguageFilter('')
      setEventFilter('')
  }

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom =
      virtualRows.length > 0
          ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
          : 0

  return (
      <>
        <Box css={{ maxWidth: 1024, margin: '0 15px'}}>
            <Box css={{ width: '100%', maxWidth: 300, margin: '80px 0 0' }}>
                <Text css={{fontSize: 72, fontWeight: 900 }}>Panacea</Text>
                <Text variant="sand">A (awesome) list of <b>open-source</b> Ludum Dare entries.</Text>
                <StyledSeparator css={{ margin: '15px 0' }} />
                <Flex css={{height: 20, alignItems: 'center'}}>
                  <Box>
                    <Anchor href='#why' variant="dotted"> Why? </Anchor>
                  </Box>
                  <StyledSeparator decorative orientation="vertical" css={{ margin: '0 15px' }} />
                  <Box>
                    <Anchor href='#credits'>Credits</Anchor>
                  </Box>
                  <StyledSeparator decorative orientation="vertical" css={{ margin: '0 15px' }} />
                  <Box>
                    <Anchor href='#about'>About</Anchor>
                  </Box>                  
                </Flex>
            </Box>
            <Box css={{margin: '15px 0'}}>
                <Flex css={{alignItems: 'center', justifyContent: 'end'}}>
                    <Box css={{marginRight: 15}}>
                        <SelectDemo data={filterValues} value={languageFilter} handler={handleSelectChange} placeholder="Pick a programming language" />
                    </Box>
                    <Box css={{marginRight: 15}}>
                        <SelectDemo data={eventFilterValues} value={eventFilter} handler={handleEventSelectChange} placeholder="Pick an event" />
                    </Box>
                    <Box>
                        <StyledButton onClick={handleResetFilters}>
                            Reset filters
                        </StyledButton>
                    </Box>
                </Flex>
            </Box>
            <Box css={{fontSize: 12, margin: "15px 0", fontWeight: 700, textAlign: 'right'}}>
                Showing {table.getRowModel().rows.length} games
            </Box>
            <Box css={{overflow: 'auto', height: 500}} ref={tableContainerRef}>
                <Table style={{borderSpacing: 0}}>
                    <thead style={{position: 'sticky', top: 0}}>
                        {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                            return (
                                <TableHeading
                                  key={header.id}
                                  colSpan={header.colSpan}
                                  style={{ width: header.getSize() }}
                                >
                                {header.isPlaceholder ? null : (
                                    <div
                                    {...{
                                        className: header.column.getCanSort()
                                        ? 'cursor-pointer select-none'
                                        : '',
                                        onClick: header.column.getToggleSortingHandler(),
                                    }}
                                    >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {{
                                        asc: ' 🔼',
                                        desc: ' 🔽',
                                    }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                )}
                                </TableHeading>
                            )
                            })}
                        </tr>
                        ))}
                    </thead>
                    <tbody>
                    {paddingTop > 0 && (
                        <tr>
                            <td style={{ height: `${paddingTop}px` }} />
                        </tr>
                    )}                  
                    {virtualRows.map(virtualRow => {
                        const row = rows[virtualRow.index] as Row<Game>
                          return (
                              <>
                                <TableRow key={row.id}>
                                  {row.getVisibleCells().map(cell => {
                                      return (
                                      <TableCell key={cell.id}>
                                          {flexRender(
                                          cell.column.columnDef.cell,
                                          cell.getContext()
                                          )}
                                      </TableCell>
                                      )
                                  })}
                                </TableRow>
                                {row.getIsExpanded() && (
                                  <TableRow>
                                    {/* 2nd row is a custom 1 cell row */}
                                    <TableCell colSpan={row.getVisibleCells().length}>
                                      {renderSubComponent({ row })}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </>
                          )
                        })}
                        {paddingBottom > 0 && (
                        <tr>
                            <td style={{ height: `${paddingBottom}px` }} />
                        </tr>
                        )}                    
                    </tbody>
                </Table>
            </Box>          
            <Box id='why' css={{margin: "80px 0 0"}}>
                <Text css={{fontSize: 72, fontWeight: 900 }}>Why?</Text>
                <Box>
                    <Text variant="sand">
                        <Paragraph>
                                There are many challenges to learning, and in many fields, learning while practicing is an even greater challenge. Many indie developers and hobbyist programmers are missing the reference implementation of key concepts and ideas in game development. In my opinion, open-source code plays a significant role in a number of different ways, one of which is in the field of education.
                        </Paragraph>
                    </Text>

                    <Text variant="sand">
                        <Paragraph>
                                The idea behind Panacea was to provide a complete list of games that have open-source code and assets. Panacea leverages Ludum Dare public API to obtain a big dataset and with the help of other APIs, categorize the entries into programming languages and engines.
                        </Paragraph>
                    </Text>
                </Box>
            </Box>

            <Box id='credits' css={{margin: "80px 0 0"}}>
                <Text css={{fontSize: 72, fontWeight: 900 }}>Credits</Text>
                <Box>
                    <Text variant="sand">
                        <Paragraph>
                                To the team maintaining <Anchor href='https://github.com/JammerCore/JammerCore' target='_blank'>Ludum Dare core repository</Anchor> and to <Anchor href="https://ldjam.com/">Ludum Dare</Anchor>, the event that got me into game design.
                        </Paragraph>
                    </Text>
                    <Text variant="sand">
                        <Paragraph>
                                To <Anchor href='https://twitter.com/mikekasprzak' target='_blank'>Mike Kasprazak</Anchor>, Ludum Dare host and showrunner.
                        </Paragraph>
                    </Text>
                    <Text variant="sand">
                        <Paragraph>
                                To yours truly, <Anchor href='https://twitter.com/inacho_' target='_blank'>Inácio Schweller</Anchor>, creator and maintainer of Panacea.
                        </Paragraph>                                        
                    </Text>
                </Box>
            </Box>

            <Box id='about' css={{margin: "80px 0 0"}}>
                <Text css={{fontSize: 72, fontWeight: 900 }}>About</Text>
                <Box>
                    <Text variant="sand">
                        <Paragraph>
                            Panacea is statictly generated React website, using <Anchor href='https://github.com/vercel/next.js/'>NextJS</Anchor> framework and hosted by <Anchor href='https://vercel.com/'>Vercel</Anchor>.
                        </Paragraph>
                    </Text>
                    <Text variant="sand">
                        <Paragraph>
                                The data is statictly hosted and publicbly available at <Anchor href='https://github.com/schweller/panacea'>Panacea repository</Anchor>.
                        </Paragraph>                    
                    </Text>
                    <Text variant="sand">
                        <Paragraph>
                                The code for this repository is open source and MIT licensed.
                        </Paragraph>
                    </Text>
                </Box>
            </Box>
            <Box id='footer'>
            
            </Box>                    
        </Box>
      </>
  );

}

export default Home
