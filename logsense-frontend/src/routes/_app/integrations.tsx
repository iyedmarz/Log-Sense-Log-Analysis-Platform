// /* eslint-disable prettier/prettier */
// import { createFileRoute } from '@tanstack/react-router';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Check, Plus } from 'lucide-react';

// const integrations = [
//   {
//     id: 'slack',
//     name: 'Slack',
//     desc: 'Send alerts to channels',
//     connected: true,
//     category: 'Notifications',
//   },
//   {
//     id: 'pagerduty',
//     name: 'PagerDuty',
//     desc: 'On-call incident routing',
//     connected: true,
//     category: 'Notifications',
//   },
//   {
//     id: 'github',
//     name: 'GitHub',
//     desc: 'Link errors to commits & PRs',
//     connected: false,
//     category: 'Source',
//   },
//   {
//     id: 'datadog',
//     name: 'Datadog',
//     desc: 'Forward metrics & traces',
//     connected: false,
//     category: 'Observability',
//   },
//   {
//     id: 'aws',
//     name: 'AWS CloudWatch',
//     desc: 'Ingest CloudWatch log groups',
//     connected: true,
//     category: 'Cloud',
//   },
//   {
//     id: 'gcp',
//     name: 'Google Cloud Logging',
//     desc: 'Stream GCP logs',
//     connected: false,
//     category: 'Cloud',
//   },
//   {
//     id: 'sentry',
//     name: 'Sentry',
//     desc: 'Sync error events',
//     connected: false,
//     category: 'Observability',
//   },
//   {
//     id: 'jira',
//     name: 'Jira',
//     desc: 'Create issues from alerts',
//     connected: false,
//     category: 'Productivity',
//   },
// ];

// export const Route = createFileRoute('/_app/integrations')({
//   component: IntegrationsPage,
//   head: () => ({ meta: [{ title: 'Integrations — LogSense' }] }),
// });

// function IntegrationsPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
//         <p className="text-sm text-muted-foreground">
//           Connect LogSense to the tools you already use
//         </p>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {integrations.map((i) => (
//           <Card
//             key={i.id}
//             className="group relative flex flex-col gap-4 p-5 transition hover:border-primary/40"
//           >
//             <div className="flex items-start justify-between">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
//                 {i.name.slice(0, 2)}
//               </div>
//               {i.connected && (
//                 <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
//                   <Check className="h-3 w-3" /> Connected
//                 </span>
//               )}
//             </div>
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold">{i.name}</h3>
//               <p className="mt-1 text-xs text-muted-foreground">{i.desc}</p>
//               <span className="mt-2 inline-block text-[10px] uppercase tracking-wider text-muted-foreground">
//                 {i.category}
//               </span>
//             </div>
//             <Button variant={i.connected ? 'outline' : 'default'} size="sm">
//               {i.connected ? (
//                 'Configure'
//               ) : (
//                 <>
//                   <Plus className="mr-1 h-3.5 w-3.5" /> Connect
//                 </>
//               )}
//             </Button>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
