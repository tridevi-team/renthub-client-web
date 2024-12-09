import type { RoomSchema } from '@modules/rooms/schema/room.schema';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { formatCurrency } from '@shared/utils/helper.util';
import { Card, Col, Row, Skeleton } from 'antd';

interface StepChooseRoomProps {
  rooms: RoomSchema[];
  selectedRoom: RoomSchema | undefined;
  setSelectedRoom: React.Dispatch<React.SetStateAction<RoomSchema | undefined>>;
}

export function StepChooseRoom({
  rooms,
  selectedRoom,
  setSelectedRoom,
}: StepChooseRoomProps) {
  const [t] = useI18n();
  if (!rooms) return <Skeleton active />;
  return (
    <Row gutter={[16, 16]}>
      {(rooms || []).map((room) => {
        const { maxRenters, price, roomArea } = room;
        return (
          <Col xs={24} sm={12} md={6} key={room.id}>
            <Card
              onClick={() =>
                setSelectedRoom((prev) =>
                  prev?.id === room.id ? undefined : room,
                )
              }
              hoverable
              className={`hover:border-2 hover:border-primary ${
                selectedRoom?.id === room.id
                  ? 'border-2 border-primary'
                  : selectedRoom
                    ? 'opacity-50'
                    : ''
              }`}
              style={{
                pointerEvents: 'auto',
                height: '100%',
              }}
            >
              <Card.Meta
                title={room.name}
                description={
                  <div>
                    <div>
                      {t('room_price')}: {formatCurrency(price ?? 0)}
                    </div>
                    <div>
                      {t('room_area')}: {roomArea} m2
                    </div>
                    <div>
                      {t('room_max_renter')}:{' '}
                      {maxRenters === -1
                        ? t('common_no')
                        : `${maxRenters} người`}
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
