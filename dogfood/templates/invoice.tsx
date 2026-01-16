import { useState } from "react";

type InvoiceData = {
	invoiceNumber: string;
	issueDate: string;
	dueDate: string;
	company: {
		name: string;
		address: string;
		city: string;
		email: string;
		phone: string;
	};
	client: {
		name: string;
		company: string;
		address: string;
		city: string;
		email: string;
	};
	items: {
		description: string;
		quantity: number;
		rate: number;
		amount: number;
	}[];
	notes: string;
};

export const Template = () => {
	const [invoiceData, setInvoiceData] = useState<InvoiceData | undefined>();

	window.injectTemplateVariables = (variables) => {
		setInvoiceData(variables as InvoiceData);
	};

	const subtotal = (invoiceData?.items ?? []).reduce(
		(sum, item) => sum + item.amount,
		0,
	);
	const taxRate = 0.08;
	const tax = subtotal * taxRate;
	const total = subtotal + tax;

	return (
		<div className="size-full bg-white">
			<div className="mx-auto max-w-4xl bg-background overflow-hidden">
				{/* Header */}
				<div className="bg-primary px-8 py-6">
					<div className="flex justify-between items-start">
						<div>
							<h1 className="text-3xl font-bold text-primary-foreground">
								INVOICE
							</h1>
							<p className="text-primary-foreground/80 mt-1">
								{invoiceData?.invoiceNumber}
							</p>
						</div>
						<div className="text-right text-primary-foreground">
							<h2 className="text-xl font-semibold">
								{invoiceData?.company.name}
							</h2>
							<p className="text-sm text-primary-foreground/80 mt-1">
								{invoiceData?.company.address}
							</p>
							<p className="text-sm text-primary-foreground/80">
								{invoiceData?.company.city}
							</p>
							<p className="text-sm text-primary-foreground/80">
								{invoiceData?.company.email}
							</p>
							<p className="text-sm text-primary-foreground/80">
								{invoiceData?.company.phone}
							</p>
						</div>
					</div>
				</div>

				{/* Billing Info */}
				<div className="px-8 py-6 border-b border-border">
					<div className="grid grid-cols-2 gap-8">
						<div>
							<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
								Bill To
							</h3>
							<p className="font-semibold text-foreground">
								{invoiceData?.client.name}
							</p>
							<p className="text-muted-foreground">
								{invoiceData?.client.company}
							</p>
							<p className="text-muted-foreground">
								{invoiceData?.client.address}
							</p>
							<p className="text-muted-foreground">
								{invoiceData?.client.city}
							</p>
							<p className="text-muted-foreground">
								{invoiceData?.client.email}
							</p>
						</div>
						<div className="text-right">
							<div className="mb-3">
								<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
									Issue Date
								</h3>
								<p className="text-foreground">{invoiceData?.issueDate}</p>
							</div>
							<div>
								<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
									Due Date
								</h3>
								<p className="text-foreground font-semibold">
									{invoiceData?.dueDate}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Items Table */}
				<div className="px-8 py-6">
					<table className="w-full">
						<thead>
							<tr className="border-b-2 border-border">
								<th className="text-left py-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
									Description
								</th>
								<th className="text-center py-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
									Qty
								</th>
								<th className="text-right py-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
									Rate
								</th>
								<th className="text-right py-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
									Amount
								</th>
							</tr>
						</thead>
						<tbody>
							{invoiceData?.items?.map((item, index) => (
								<tr key={index} className="border-b border-border">
									<td className="py-4 text-foreground">{item.description}</td>
									<td className="py-4 text-center text-muted-foreground">
										{item.quantity}
									</td>
									<td className="py-4 text-right text-muted-foreground">
										$
										{item.rate.toLocaleString("en-US", {
											minimumFractionDigits: 2,
										})}
									</td>
									<td className="py-4 text-right font-medium text-foreground">
										$
										{item.amount.toLocaleString("en-US", {
											minimumFractionDigits: 2,
										})}
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Totals */}
					<div className="mt-6 flex justify-end">
						<div className="w-64">
							<div className="flex justify-between py-2">
								<span className="text-muted-foreground">Subtotal</span>
								<span className="text-foreground">
									$
									{subtotal.toLocaleString("en-US", {
										minimumFractionDigits: 2,
									})}
								</span>
							</div>
							<div className="flex justify-between py-2">
								<span className="text-muted-foreground">Tax (8%)</span>
								<span className="text-foreground">
									${tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}
								</span>
							</div>
							<div className="flex justify-between py-3 border-t-2 border-primary mt-2">
								<span className="text-lg font-bold text-foreground">Total</span>
								<span className="text-lg font-bold text-foreground">
									${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="bg-muted px-8 py-6">
					<div className="flex justify-between items-center">
						<div>
							<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
								Notes
							</h3>
							<p className="text-muted-foreground">{invoiceData?.notes}</p>
						</div>
						<div className="text-right">
							<p className="text-sm text-muted-foreground">
								Questions? Contact us at{" "}
								<span className="text-foreground font-medium">
									{invoiceData?.company?.email}
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const previewVariables = {
	invoiceNumber: "INV-2026-001",
	issueDate: "January 16, 2026",
	dueDate: "February 16, 2026",
	company: {
		name: "Acme Corporation",
		address: "123 Business Avenue",
		city: "San Francisco, CA 94102",
		email: "billing@acmecorp.com",
		phone: "(555) 123-4567",
	},
	client: {
		name: "John Smith",
		company: "Smith Enterprises",
		address: "456 Client Street",
		city: "New York, NY 10001",
		email: "john@smithenterprises.com",
	},
	items: [
		{ description: "Website Design", quantity: 1, rate: 2500, amount: 2500 },
		{
			description: "Frontend Development",
			quantity: 40,
			rate: 150,
			amount: 6000,
		},
		{
			description: "Backend Development",
			quantity: 30,
			rate: 175,
			amount: 5250,
		},
		{
			description: "UI/UX Consultation",
			quantity: 10,
			rate: 200,
			amount: 2000,
		},
	],
	notes: "Thank you for your business! Payment is due within 30 days.",
} satisfies InvoiceData;
