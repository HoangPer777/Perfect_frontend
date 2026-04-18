export default function CustomerDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My History & Orders</h1>

      <div className="flex border-b mb-8">
        <button className="px-6 py-2 font-bold border-b-2 border-primary">Purchased Services</button>
        <button className="px-6 py-2 font-medium text-muted-foreground">Bought Products</button>
      </div>

      <div className="space-y-6">
        {/* Service Orders (Tasks) */}
        <div className="p-6 border rounded-xl bg-white">
          <h2 className="text-xl font-bold mb-4">Active Service Requests</h2>
          {/* TODO: Display list of tasks with current status */}
          <div className="space-y-4">
            {/* Example Task Card Skeleton */}
            <div className="p-4 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold">Logo Redesign</p>
                <p className="text-sm text-muted-foreground">Designer: CreativeArt | Status: <span className="text-blue-500">Processing</span></p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-sm">Revisions Left: 3</span>
                <button className="text-sm border px-3 py-1 rounded">View Details</button>
              </div>
            </div>
            
            <p className="text-muted-foreground text-center py-8">No other active tasks.</p>
          </div>
        </div>

        {/* Product Purchase History */}
        <div className="p-6 border rounded-xl bg-white">
          <h2 className="text-xl font-bold mb-4">Product Purchase History</h2>
          {/* TODO: Map purchased digital images/files */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted text-sm px-4">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td colSpan={4} className="p-12 text-center text-muted-foreground italic">No products purchased yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TODO: Implement "Review & Complaint" popup trigger */}
    </div>
  );
}
