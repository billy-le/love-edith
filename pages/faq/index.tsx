import { MainLayout } from '@layouts/main';

export default function FaqPage() {
  return (
    <MainLayout title='FAQ'>
      <div className='mx-auto text-sm prose text-black'>
        {/* Preorder Policy */}
        <h2 className='text-center'>Pre-Order Policy</h2>

        <div>
          <p>Please allow 10-15 business days for your pre-order to be fulfilled.</p>

          <p>
            This does not include shipping days which take 1-3 business days for Metro Manila and 3-7 days for
            provincial.
          </p>

          <hr style={{ margin: '1.5rem 0' }} />

          <p className='text-base text-center'>
            Our latest cut-off date is{' '}
            <span className='font-bold border-b border-black border-solid'>July 10, 2021</span>
          </p>

          <p className='text-center'>Pre-order cut-off is every two (2) weeks.</p>

          <h3>Important Notes:</h3>
          <ol>
            <li>
              If you order before the latest cut-off date, you will be included in the corresponding batch and you will
              receive your order in 10-15 business days (not including weekends and holidays) + shipping lead time (1-3
              business days for MM; 3-7 for provincial).
            </li>
            <li>
              If you order after the latest cut-off date, you will be included in the next cut-off date and batch.
            </li>
            <li>
              Slots are very limited for every cut-off. Only complete and paid orders will be included in the batch.
              Unpaid orders in your cart will not secure your slot. Please see our Payment Policy.
            </li>
            <li>
              Announcements will be made when slots are full for the current batch. Once full, pre-orders will be
              automatically included in the next batch.
            </li>
            <li>Checking out items means you have read and agreed to our terms and conditions.</li>
          </ol>
        </div>

        {/* Shipping */}
        <h2 className='text-center'>Shipping</h2>
        <h3>Metro Manila</h3>
        <ul>
          <li>
            Standard Courier via Fifth Express
            <br />
            (1-3 days) P79
          </li>
          <li>
            Same Day Delivery/Pick-Up* via Third Party Courier i.e. Grab/Lalamove/Mr. Speedy
            <br />
            1pm - 5pm only
            <br />
            Location**: Eastwood, Quezon City
          </li>
        </ul>

        <h3>Non-Metro Manila</h3>
        <ul>
          <li>
            Standard Courier via J&T Express
            <br />
            (3-7 days) P150
          </li>
        </ul>

        <p>No deliveries/pick-ups on Sundays & Holidays unless stated otherwise.</p>
        <p>We will notify you once your order has been shipped along with the tracking number.</p>

        <p className='italic font-bold'>
          *Please contact us right away; we will always try to accommodate rush orders/same day deliveries as much as we
          can.
        </p>

        <ul>
          <li>We shall not be held responsible for any delay, damage or loss of item during transit.</li>
          <li>We reserve the right to refuse same day deliveries.</li>
        </ul>

        <p>**Complete address shall be provided once order is confirmed.</p>

        {/* Payment */}
        <h2 className='text-center'>Payment</h2>
        <div>
          <p>Modes of payment are:</p>
          <ul>
            <li>GCash</li>
            <li>BPI</li>
          </ul>
        </div>

        <p>Payment details will be sent thru email after you have submitted an order.</p>
        <p>
          Please note that unpaid orders do not confirm your items in your cart as we only process items when payment is
          received and confirmed.
        </p>
        <p className='italic'>
          If someone else has ordered the same items and they made payment before you, your order might be automatically
          cancelled.
        </p>
        <p>We advise you to settle payment in real time.</p>

        {/* Refund Policy */}
        <h2 className='text-center'>Return Policy</h2>
        <p>
          For pieces that are made-to-order and on pre-order,{' '}
          <span className='font-bold'>we do not allow exchanges and returns.</span> This is for safety reasons brought
          about by COVID-19.
        </p>
        <p>
          We ensure all items are correct according to your order form and in perfect condition when we ship it to you.
          In the event that a wrong or damaged item was shipped to you, we're
          <span className='font-bold'> so sorry.</span> Please notify us with your order details and photos of the item
          received within<span className='font-bold'> 5 days</span> from the day you receive your package. Please allow
          us
          <span className='font-bold'> 2 weeks</span> from the day that we receive your return to process
          return/refund/exchange requests.
        </p>
        <p>Love, Edith reserves the right to refuse returns that do not meet our return policies.</p>

        {/* Manufacturing */}
        <h2 className='text-center'>Where are your pieces manufactured?</h2>
        <p>
          All clothings are ethically sourced and manufactured locally in the Philippines by a small group of talented
          women.
        </p>
      </div>
    </MainLayout>
  );
}
