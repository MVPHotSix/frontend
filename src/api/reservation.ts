import { IPostReservation, IReservationFull } from '../types/reservation.ts'
import { VITE_SERVER_URL } from '../config'

export async function postReservation(request: IPostReservation): Promise<void> {
    const res = await fetch(`${VITE_SERVER_URL}/api/v1/reservation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${request.secret.token}`,
        },
        body: JSON.stringify(request.body),
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(JSON.stringify(data))
    }
    return
}

export async function getReservationRecent(size: number, token: string): Promise<{ reservations: IReservationFull[] }> {
    const res = await fetch(`${VITE_SERVER_URL}/api/v1/reservation/recently-finished?size=${size}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(JSON.stringify(data))
    }
    return res.json()
}

export async function cancelReservation(reservationId: number, token: string): Promise<void> {
    const res = await fetch(`${VITE_SERVER_URL}/api/v1/reservation/${reservationId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
    if (!res.ok) {
        throw new Error('예약 취소에 실패했습니다.')
    }
}
