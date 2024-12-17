import { cn } from '@app/lib/utils';
import { Marquee } from '@shared/components/extensions/marquee';

const files = [
  {
    name: 'contract_101.pdf',
    body: 'Hợp đồng thuê phòng 101, bao gồm các điều khoản và điều kiện thuê phòng.',
  },
  {
    name: 'invoice_101.xlsx',
    body: 'Hóa đơn thanh toán cho phòng 101, bao gồm chi tiết các khoản phí và thanh toán.',
  },
  {
    name: 'tenant_info_201.svg',
    body: 'Thông tin người thuê phòng 201, bao gồm tên, địa chỉ và thông tin liên lạc.',
  },
  {
    name: 'maintenance_report_202.gpg',
    body: 'Báo cáo bảo trì cho phòng 202, bao gồm các công việc bảo trì đã thực hiện và chi phí liên quan.',
  },
  {
    name: 'payment_receipt_101.txt',
    body: 'Biên lai thanh toán cho phòng 101, xác nhận đã nhận được thanh toán từ người thuê.',
  },
];

const ContractMarquee = () => {
  return (
    <Marquee
      pauseOnHover
      className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_1%,#000_100%)] "
    >
      {files.map((f, idx) => (
        <figure
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={idx}
          className={cn(
            'relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4',
            'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
            'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
            'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none',
          )}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col">
              <figcaption className="font-medium text-sm dark:text-white ">
                {f.name}
              </figcaption>
            </div>
          </div>
          <blockquote className="mt-2 text-xs">{f.body}</blockquote>
        </figure>
      ))}
    </Marquee>
  );
};

export default ContractMarquee;
