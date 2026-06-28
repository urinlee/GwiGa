
export interface RoomWithSlug {
    params: Promise<{ id: string }>
}

export async function GET(req: Request, { params }: RoomWithSlug) {
    const { id } = await params;
    const roomId = id

    const user = await currentUser()
    
}