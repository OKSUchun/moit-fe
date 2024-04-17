import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { meetingKeys } from '@/constants/queryKeys'
import { getMeetingsBySearch } from '@/apis/meeting'
import {
  CardBox,
  EmptyTextBox,
  InputBox,
  MeetingCard,
  SearchBox,
  SearchLayout,
  RecentTagBox,
  ToggleBox,
  ToggleButton,
} from './styles'
import { type GetMeeting } from '@/type/meeting'
import { getLocalStorageItem, setLocalStorageItem } from '@/util/localStorage'
import {
  CardIconText,
  ContentsBox,
  TextBox,
  TagBox,
} from '@/components/meeting/MeetingCard/styles'

export default function Search(): JSX.Element {
  const [inputText, setInputText] = useState('')
  const [keyword, setKeyword] = useState('')
  const [recents, setRecents] = useState<string[]>(
    (getLocalStorageItem('recents') as string[]) ?? []
  )
  const [onRecentsToggle, setOnRecentsToggle] = useState(true)
  const navigate = useNavigate()

  const { data } = useInfiniteQuery({
    queryKey: meetingKeys.search(keyword),
    queryFn: async ({ pageParam }) => {
      return await getMeetingsBySearch({ text: keyword, pageParam })
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.isLast) return lastPage.nextPage
      return undefined
    },
    initialPageParam: 1,
    enabled: keyword !== '',
  })

  const meetings = useMemo(() => {
    let list: GetMeeting[] = []
    data != null &&
      data.pages.forEach(({ result }) => (list = [...list, ...result]))
    return list
  }, [data])

  const handleSearch = (): void => {
    if (inputText.trim().length === 0) {
      window.alert('검색어를 입력해 주세요.')
      return
    }
    setKeyword(inputText)
    handleRecents(inputText)
  }

  const handleRecents = (text: string): void => {
    const prevRecents = getLocalStorageItem('recents') as string[]
    if (prevRecents == null) {
      setLocalStorageItem('recents', [text])
    } else {
      const currentRecents = [
        text,
        ...prevRecents.filter((word) => word !== text),
      ].slice(0, 10)
      setLocalStorageItem('recents', currentRecents)
    }
    setRecents([text, ...recents.filter((word) => word !== text)].slice(0, 10))
  }

  return (
    <SearchLayout>
      <SearchBox>
        <div className="input-flex-box">
          <button
            type="button"
            onClick={() => {
              navigate(-1)
            }}
          >
            <img src="/assets/left.svg" alt="icon" />
          </button>
          <InputBox>
            <input
              type="text"
              placeholder="모임 이름, 모임 내용, 주소를 검색해 보세요"
              value={inputText}
              onChange={(e) => {
                setInputText(e.currentTarget.value)
              }}
            />
            <button type="button" onClick={handleSearch}>
              <img src="/assets/search.svg" alt="icon" />
            </button>
          </InputBox>
        </div>
        <ToggleBox>
          <ToggleButton
            onClick={() => {
              setOnRecentsToggle(!onRecentsToggle)
            }}
          >
            <h1>
              <img src="/assets/watch.svg" alt="watch" />
              최근 검색어
            </h1>
            {onRecentsToggle ? (
              <img src="/assets/up.svg" alt="up" />
            ) : (
              <img src="/assets/down.svg" alt="down" />
            )}
          </ToggleButton>
          {onRecentsToggle &&
            (recents.length !== 0 ? (
              <RecentTagBox>
                {recents.map((word, index) => (
                  <button
                    type="button"
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${word}_${index}`}
                    value={word}
                    onClick={(e) => {
                      setInputText(e.currentTarget.value)
                      setKeyword(e.currentTarget.value)
                    }}
                  >
                    {word}
                  </button>
                ))}
              </RecentTagBox>
            ) : (
              <EmptyTextBox>
                <img src="/assets/warning.svg" alt="warning" />
                <p>최근 검색한 내용이 없습니다</p>
              </EmptyTextBox>
            ))}
        </ToggleBox>
      </SearchBox>
      {data != null && (
        <CardBox>
          {meetings.length === 0 ? (
            <p>조회된 내용이 없습니다</p>
          ) : (
            <>
              {meetings.map(
                ({
                  meetingId,
                  meetingName,
                  locationAddress,
                  meetingDate,
                  meetingEndTime,
                  meetingStartTime,
                  registeredCount,
                  totalCount,
                  skillList,
                }) => (
                  <MeetingCard
                    key={meetingId}
                    onClick={() => {
                      navigate(`/meetings/${meetingId}`)
                    }}
                  >
                    <h2>{meetingName}</h2>
                    <div className="card-flex-box">
                      <ContentsBox>
                        <TextBox>
                          <CardIconText>
                            <img src="/assets/time.svg" alt="time" />
                            <p>{`${meetingDate} | ${meetingStartTime} - ${meetingEndTime}`}</p>
                          </CardIconText>
                          <div className="flex-box">
                            <CardIconText>
                              <img src="/assets/pin.svg" alt="pin" />
                              <p>{`${locationAddress.split(' ')[0]} ${locationAddress.split(' ')[1]}`}</p>
                            </CardIconText>
                            <CardIconText>
                              <img src="/assets/member.svg" alt="member" />
                              <p>{`${registeredCount} / ${totalCount}`}</p>
                            </CardIconText>
                          </div>
                        </TextBox>
                        <TagBox>
                          <div>
                            {skillList.map(({ skillName, id }) => (
                              <p key={`${id}_${skillName}`}>{skillName}</p>
                            ))}
                          </div>
                        </TagBox>
                      </ContentsBox>
                      <img src="/assets/right.svg" alt="right" />
                    </div>
                  </MeetingCard>
                )
              )}
            </>
          )}
        </CardBox>
      )}
    </SearchLayout>
  )
}
