import { cn } from '@app/lib/utils';
import { useHouseStore } from '@app/stores';
import { useAuthUserStore } from '@modules/auth/hooks/use-auth-user-store.hook';
import { housePath } from '@modules/houses/routes';
import { Button } from '@shared/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@shared/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components/ui/popover';
import { ScrollArea } from '@shared/components/ui/scroll-area';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Check, ChevronsUpDown, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function HouseSelect() {
  const [t] = useI18n();
  const { user } = useAuthUserStore();
  const { data: selectedHouse, setData: setSelectedHouse } = useHouseStore();
  const [open, setOpen] = useState(false);

  const houses = user?.houses || [];

  useEffect(() => {
    if (!selectedHouse && houses.length > 0) {
      setSelectedHouse(houses[0]);
    }
  }, [houses, selectedHouse, setSelectedHouse]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="mr-1 h-9 w-64 justify-between"
        >
          <div className="flex items-center gap-2 truncate">
            <Home className="h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">
              {selectedHouse ? selectedHouse.name : t('ph_house_select')}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command className="flex flex-col">
          <CommandInput placeholder={t('ph_house_select')} />
          <CommandList className="overflow-hidden">
            {houses.length === 0 ? (
              <></>
            ) : (
              <ScrollArea className="h-80 pb-3">
                <CommandGroup>
                  {houses.map((house) => (
                    <CommandItem
                      key={house.id}
                      onSelect={() => {
                        if (selectedHouse?.id === house.id) {
                          setSelectedHouse(house);
                        } else {
                          setSelectedHouse(house);
                        }
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedHouse?.id === house.id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{house.name}</span>
                        <span className="text-muted-foreground text-sm">
                          {[
                            house.address.street,
                            house.address.ward,
                            house.address.district,
                            house.address.city,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            )}
          </CommandList>
          <div className="border-t">
            <CommandGroup>
              <CommandItem
                asChild
                className="mx-auto flex w-full items-center justify-center py-2"
              >
                {houses.length === 0 ? (
                  <Link
                    to={`${housePath.root}/${housePath.create}`}
                    className="font-medium"
                  >
                    {t('br_houses_create')}
                  </Link>
                ) : (
                  <Link to={housePath.index} className="font-medium">
                    {t('br_houses')}
                  </Link>
                )}
              </CommandItem>
            </CommandGroup>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
