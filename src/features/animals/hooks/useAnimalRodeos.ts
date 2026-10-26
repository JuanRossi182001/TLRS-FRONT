import { useQuery } from '@tanstack/react-query';
import { getRodeo } from '../../rodeos/api/rodeos.api';
import { getMyRodeos } from '../../rodeos/api/rodeos.api';

export function useAnimalRodeos() {
  return useQuery<Map<number, string[]>>({
    queryKey: ['animals', 'rodeo-memberships'],
    queryFn: async () => {
      const rodeos = await getMyRodeos();
      const details = await Promise.all(rodeos.map((rodeo) => getRodeo(rodeo.id_asset_group)));
      const memberships = new Map<number, string[]>();

      details.forEach((rodeo) => {
        rodeo.members.forEach((member) => {
          const names = memberships.get(member.asset_id) ?? [];
          names.push(rodeo.name);
          memberships.set(member.asset_id, names);
        });
      });

      return memberships;
    },
  });
}
