export default function DesignerDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Designer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {/* Statistics Widgets */}
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <p className="text-muted-foreground text-sm font-medium">Total Products</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <p className="text-muted-foreground text-sm font-medium">Active Tasks</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold">$0</p>
        </div>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <p className="text-muted-foreground text-sm font-medium">Trust Score</p>
          <p className="text-3xl font-bold">N/A</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="p-6 border rounded-xl bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Manage Products</h2>
            <button className="text-primary font-medium text-sm">+ Add New</button>
          </div>
          {/* TODO: Implement product list with Edit/Delete buttons */}
          <p className="text-muted-foreground text-center py-12">No products found.</p>
        </section>

        <section className="p-6 border rounded-xl bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Manage Service Packages</h2>
            <button className="text-primary font-medium text-sm">+ Add New</button>
          </div>
          {/* TODO: Implement basic, pro, vip packages management */}
          <p className="text-muted-foreground text-center py-12">No packages configured.</p>
        </section>
      </div>

      <section className="mt-8 p-6 border rounded-xl bg-white">
        <h2 className="text-xl font-bold mb-6">Active Tasks (Jobs)</h2>
        {/* TODO: Implement Table with status: PENDING, PROCESSING, REVIEWING */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted text-sm font-medium">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* TODO: Map active tasks */}
              <tr className="border-t">
                <td colSpan={4} className="p-12 text-center text-muted-foreground">No active tasks found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* TODO: Add Analytics Chart component (Recharts) */}
    </div>
  );
}
