import { loadEnv, Modules, defineConfig } from '@medusajs/framework/utils';
import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  SHOULD_DISABLE_ADMIN,
  STORE_CORS,
  STRIPE_API_KEY,
  STRIPE_WEBHOOK_SECRET,
  WORKER_MODE,
  MEILISEARCH_HOST,
  MEILISEARCH_ADMIN_KEY,
  // Add Supabase imports
  SUPABASE_ACCESS_KEY_ID,
  SUPABASE_SECRET_ACCESS_KEY,
  SUPABASE_S3_ENDPOINT,
  SUPABASE_PROJECT_REF
} from 'lib/constants';

loadEnv(process.env.NODE_ENV, process.cwd());

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    workerMode: WORKER_MODE,
    http: {
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      storeCors: STORE_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET
    },
    build: {
      rollupOptions: {
        external: ["@medusajs/dashboard"]
      }
    }
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
  },
  modules: [
    {
      key: Modules.FILE,
      resolve: '@medusajs/file',
      options: {
        providers: [
          // ✅ SUPABASE S3-COMPATIBLE STORAGE
      //     {
      //   resolve: '@medusajs/file-s3',
      //   id: 's3',
      //   options: {
      //     access_key_id: SUPABASE_ACCESS_KEY_ID,
      //     secret_access_key: SUPABASE_SECRET_ACCESS_KEY,
      //     region: 'eu-west-2', // Supabase region
      //     bucket: 'products',
      //     // FIXED: Corrected endpoint without /storage/v1/s3
      //     endpoint: 'https://nbbyjmuwlvhshplrerd.storage.supabase.co/storage/v1/s3',
      //     s3ForcePathStyle: true,
      //     signature_version: 'v4',
      //     additional_client_config: {
      //       forcePathStyle: true
      //     }
      //   },
      // }
      {
  resolve: '@medusajs/file-s3',
  id: 's3',
  options: {
    access_key_id: SUPABASE_ACCESS_KEY_ID,
    secret_access_key: SUPABASE_SECRET_ACCESS_KEY,
    region: 'eu-west-2', // Keep this for Supabase
    bucket: 'products',
    endpoint: 'https://nbbyjmuwlvhshplrerd.storage.supabase.co/storage/v1/s3',
    s3ForcePathStyle: true,
    signature_version: 'v4',
    // Additional options that might help
    additional_client_config: {
      forcePathStyle: true,
      signatureVersion: 'v4',
      s3DisableBodySigning: false,
    }
  },
}

      //       {
      //   resolve: '@medusajs/file-supabase',
      //   id: 'supabase',
      //   options: {
      //     referenceID: 'nbbyjmuwlvhshplrerd', // Your project ref
      //     serviceKey: process.env.SUPABASE_SERVICE_KEY, // You need this - see below
      //     bucketName: 'products',
      //     // Optional: organize files in folders
      //     directory: 'product-images'
      //   },
      // }
          
          // ❌ CLOUDINARY REMOVED - Using Supabase instead
          // {
          //   resolve: '@medusajs/file-cloudinary',
          //   id: 'cloudinary',
          //   options: {
          //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          //     api_key: process.env.CLOUDINARY_API_KEY,
          //     api_secret: process.env.CLOUDINARY_API_SECRET,
          //     secure: true,
          //   },
          // }
        ]
      }
    },
    
    // ✅ Using in-memory alternatives for EventBus and WorkflowEngine
    {
      key: Modules.EVENT_BUS,
      resolve: '@medusajs/event-bus-local',
    },
    {
      key: Modules.WORKFLOW_ENGINE,
      resolve: '@medusajs/workflow-engine-inmemory',
    },

    // ✅ Email notifications (keep if you have the keys)
    ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL || RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
      key: Modules.NOTIFICATION,
      resolve: '@medusajs/notification',
      options: {
        providers: [
          ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL ? [{
            resolve: '@medusajs/notification-sendgrid',
            id: 'sendgrid',
            options: {
              channels: ['email'],
              api_key: SENDGRID_API_KEY,
              from: SENDGRID_FROM_EMAIL,
            }
          }] : []),
          ...(RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
            resolve: './src/modules/email-notifications',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: RESEND_API_KEY,
              from: RESEND_FROM_EMAIL,
            },
          }] : []),
        ]
      }
    }] : []),

    // ✅ Payment processing (keep if you have Stripe keys)
    ...(STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET ? [{
      key: Modules.PAYMENT,
      resolve: '@medusajs/payment',
      options: {
        providers: [
          {
            resolve: '@medusajs/payment-stripe',
            id: 'stripe',
            options: {
              apiKey: STRIPE_API_KEY,
              webhookSecret: STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    }] : [])
  ],
  plugins: [
    // ✅ Search functionality (keep if you have MeiliSearch)
    ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY ? [{
      resolve: '@rokmohar/medusa-plugin-meilisearch',
      options: {
        config: {
          host: MEILISEARCH_HOST,
          apiKey: MEILISEARCH_ADMIN_KEY
        },
        settings: {
          products: {
            type: 'products',
            enabled: true,
            fields: ['id', 'title', 'description', 'handle', 'variant_sku', 'thumbnail'],
            indexSettings: {
              searchableAttributes: ['title', 'description', 'variant_sku'],
              displayedAttributes: ['id', 'handle', 'title', 'description', 'variant_sku', 'thumbnail'],
              filterableAttributes: ['id', 'handle'],
            },
            primaryKey: 'id',
          }
        }
      }
    }] : [])
  ]
};

console.log(JSON.stringify(medusaConfig, null, 2));
export default defineConfig(medusaConfig);


// import { loadEnv, Modules, defineConfig } from '@medusajs/framework/utils';
// import {
//   ADMIN_CORS,
//   AUTH_CORS,
//   BACKEND_URL,
//   COOKIE_SECRET,
//   DATABASE_URL,
//   JWT_SECRET,
//   RESEND_API_KEY,
//   RESEND_FROM_EMAIL,
//   SENDGRID_API_KEY,
//   SENDGRID_FROM_EMAIL,
//   SHOULD_DISABLE_ADMIN,
//   STORE_CORS,
//   STRIPE_API_KEY,
//   STRIPE_WEBHOOK_SECRET,
//   WORKER_MODE,
//   MEILISEARCH_HOST,
//   MEILISEARCH_ADMIN_KEY
// } from 'lib/constants';

// // Remove loadEnv - it's not working in your version
// loadEnv(process.env.NODE_ENV, process.cwd());

// const medusaConfig = {
//   projectConfig: {
//     databaseUrl: DATABASE_URL,
//     databaseLogging: false,
//     workerMode: WORKER_MODE,
//     http: {
//       adminCors: ADMIN_CORS,
//       authCors: AUTH_CORS,
//       storeCors: STORE_CORS,
//       jwtSecret: JWT_SECRET,
//       cookieSecret: COOKIE_SECRET
//     },
//     build: {
//       rollupOptions: {
//         external: ["@medusajs/dashboard"]
//       }
//     }
//   },
//   admin: {
//     backendUrl: BACKEND_URL,
//     disable: SHOULD_DISABLE_ADMIN,
//   },
//   modules: [
//     {
//       key: Modules.FILE,
//       resolve: '@medusajs/file',
//       options: {
//         providers: [
//           // ✅ CUSTOM SUPABASE DIRECT INTEGRATION
//           {
//             resolve: './src/services/file-service',
//             id: 'supabase',
//           }
//         ]
//       }
//     },
    
//     // ✅ Using in-memory alternatives for EventBus and WorkflowEngine
//     {
//       key: Modules.EVENT_BUS,
//       resolve: '@medusajs/event-bus-local',
//     },
//     {
//       key: Modules.WORKFLOW_ENGINE,
//       resolve: '@medusajs/workflow-engine-inmemory',
//     },

//     // ✅ Email notifications (keep if you have the keys)
//     ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL || RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
//       key: Modules.NOTIFICATION,
//       resolve: '@medusajs/notification',
//       options: {
//         providers: [
//           ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL ? [{
//             resolve: '@medusajs/notification-sendgrid',
//             id: 'sendgrid',
//             options: {
//               channels: ['email'],
//               api_key: SENDGRID_API_KEY,
//               from: SENDGRID_FROM_EMAIL,
//             }
//           }] : []),
//           ...(RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
//             resolve: './src/modules/email-notifications',
//             id: 'resend',
//             options: {
//               channels: ['email'],
//               api_key: RESEND_API_KEY,
//               from: RESEND_FROM_EMAIL,
//             },
//           }] : []),
//         ]
//       }
//     }] : []),

//     // ✅ Payment processing (keep if you have Stripe keys)
//     ...(STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET ? [{
//       key: Modules.PAYMENT,
//       resolve: '@medusajs/payment',
//       options: {
//         providers: [
//           {
//             resolve: '@medusajs/payment-stripe',
//             id: 'stripe',
//             options: {
//               apiKey: STRIPE_API_KEY,
//               webhookSecret: STRIPE_WEBHOOK_SECRET,
//             },
//           },
//         ],
//       },
//     }] : [])
//   ],
//   plugins: [
//     // ✅ Search functionality (keep if you have MeiliSearch)
//     ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY ? [{
//       resolve: '@rokmohar/medusa-plugin-meilisearch',
//       options: {
//         config: {
//           host: MEILISEARCH_HOST,
//           apiKey: MEILISEARCH_ADMIN_KEY
//         },
//         settings: {
//           products: {
//             type: 'products',
//             enabled: true,
//             fields: ['id', 'title', 'description', 'handle', 'variant_sku', 'thumbnail'],
//             indexSettings: {
//               searchableAttributes: ['title', 'description', 'variant_sku'],
//               displayedAttributes: ['id', 'handle', 'title', 'description', 'variant_sku', 'thumbnail'],
//               filterableAttributes: ['id', 'handle'],
//             },
//             primaryKey: 'id',
//           }
//         }
//       }
//     }] : [])
//   ]
// };

// console.log(JSON.stringify(medusaConfig, null, 2));
// export default defineConfig(medusaConfig);