import React from 'react'
import styled from 'styled-components'
import { IGetDesignerListFilter } from '../types/designer'
import { useNavigate } from 'react-router-dom'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getDesigners } from '../api/designer.ts'
import { userStore } from '../store/user.ts'
import { ISearchContext } from '../types/context.ts'

interface ProfileListComponentProps {
    filter: IGetDesignerListFilter
    setContext: (context: ISearchContext) => void
    time: Date
}

const ProfileListComponent: React.FC<ProfileListComponentProps> = ({ filter, setContext, time }) => {
    const { getToken } = userStore()
    const navigate = useNavigate()
    const { data } = useSuspenseQuery({
        queryKey: ['designer', filter],
        queryFn: () => getDesigners(filter, getToken()),
        staleTime: 0,
        gcTime: 0,
    })

    if (!data || data.designers.length === 0) {
        return <></>
    }

    return (
        <ListContainer>
            {data.designers.map(designer => {
                const types = designer.meetingType.split('/')
                return (
                    <StyledLink
                        key={designer.id}
                        onClick={() => {
                            setContext({
                                designer: designer,
                                date: time,
                            })
                            console.log(time)
                            navigate('payment')
                        }}
                    >
                        <ProfileCard>
                            <ProfileInfo>
                                <TopBox>
                                    <NameBox>
                                        <Name>{designer.name}</Name>
                                        <ConsultationType>{designer.meetingType}</ConsultationType>
                                    </NameBox>
                                    <Specialties>{`전문분야: ${designer.specialization}`}</Specialties>
                                    <Specialties>{designer.description}</Specialties>
                                </TopBox>
                                <BottomBox>
                                    <Region>{designer.region}</Region>
                                    {types[0] === '대면' && <ConsultingFee>{`대면: ${designer.offlinePrice.toLocaleString()}원`}</ConsultingFee>}
                                    {(types[0] === '비대면' || (types.length === 2 && types[1] === '비대면')) && (
                                        <ConsultingFee>{`비대면: ${designer.onlinePrice.toLocaleString()}원`}</ConsultingFee>
                                    )}
                                </BottomBox>
                            </ProfileInfo>
                            <ProfileImage src={designer.profileImageURL} alt={designer.name} />
                        </ProfileCard>
                    </StyledLink>
                )
            })}
        </ListContainer>
    )
}

export default ProfileListComponent

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 2rem;
`

const StyledLink = styled.div`
    text-decoration: none;
    color: inherit;
`

const ProfileCard = styled.div`
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 0.1rem solid #e0e0e0;
    border-radius: 0.5rem;
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
`

const ProfileImage = styled.img`
    width: 15rem;
    height: 20rem;
    border-radius: 1rem;
    object-fit: cover;
`

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 20rem;
    padding: 0 0.5rem;
`

const TopBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const NameBox = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
`

const Name = styled.h3`
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
`

const Region = styled.div`
    font-size: 1.4rem;
    color: #292929;
`

const BottomBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const Specialties = styled.div`
    font-size: 1.2rem;
    color: #000000;
    text-align: left;
    max-width: 20rem;
    margin: 0.3rem 0;
`

const ConsultingFee = styled.div`
    font-size: 1.8rem;
    font-weight: bold;
    color: #35376e;
`

const ConsultationType = styled.div`
    font-size: 1.2rem;
    color: #666;
`
