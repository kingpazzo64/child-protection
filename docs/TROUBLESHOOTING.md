# Troubleshooting Guide

## Database Connection Errors

### Error: "Can't reach database server at `aws-0-eu-north-1.pooler.supabase.com:5432`"

This error indicates that the application cannot connect to the PostgreSQL database. Here are common causes and solutions:

#### 1. **Database Server Status (Supabase)**
   - **Check Supabase Dashboard**: Log into your Supabase project dashboard and verify:
     - Database is not paused (free tier databases pause after inactivity)
     - Database is running and accessible
     - Project is not suspended or deleted
   
   - **Restart Database**: If paused, click "Restore" or "Resume" in the Supabase dashboard

#### 2. **Connection String Issues**
   - **Verify DATABASE_URL**: Check that your `DATABASE_URL` environment variable is set correctly
   - **Format**: For Supabase, the connection string should look like:
     ```
     postgresql://postgres:[PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:5432/postgres?pgbouncer=true
     ```
   - **Direct Connection vs Pooler**: 
     - Use `pooler.supabase.com` for connection pooling (recommended for serverless)
     - Use direct connection for migrations: `db.[project-ref].supabase.co:5432`
   
   - **Password**: Ensure the password is URL-encoded if it contains special characters
   - **SSL Mode**: Supabase requires SSL connections. Add `?sslmode=require` if not using pgbouncer

#### 3. **Environment Variables**
   - **Vercel**: Verify `DATABASE_URL` is set in Vercel environment variables
     - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
     - Ensure it's set for the correct environment (Production, Preview, Development)
     - Restart the deployment after adding/changing environment variables
   
   - **Local Development**: Check your `.env` file:
     ```bash
     # Verify the variable is set
     echo $DATABASE_URL
     ```

#### 4. **Network/Firewall Issues**
   - **Vercel IP Allowlist**: If your Supabase project has IP restrictions, you may need to:
     - Allow all IPs (0.0.0.0/0) for serverless deployments
     - Or use Supabase's connection pooling which handles this automatically
   
   - **Firewall Rules**: Check Supabase dashboard → Settings → Database → Connection Pooling
     - Ensure "Connection Pooling" is enabled
     - Verify the pooler endpoint is correct

#### 5. **Connection Pooling**
   - **Supabase Pooler**: Use the pooler endpoint (`pooler.supabase.com`) for serverless functions
   - **Connection Limits**: Free tier has connection limits; ensure you're not exceeding them
   - **Timeout Settings**: Increase connection timeout if needed:
     ```
     ?pgbouncer=true&connection_limit=10&pool_timeout=10
     ```

#### 6. **Prisma Client Issues**
   - **Regenerate Client**: After schema changes, regenerate Prisma client:
     ```bash
     npx prisma generate
     ```
   
   - **Migration Status**: Ensure migrations are applied:
     ```bash
     npx prisma migrate deploy
     ```

#### 7. **Temporary Outages**
   - **Supabase Status**: Check [Supabase Status Page](https://status.supabase.com/)
   - **Retry Logic**: The application now includes error handling that allows graceful degradation
   - **Wait and Retry**: Sometimes temporary network issues resolve themselves

### Quick Checks

1. **Test Database Connection**:
   ```bash
   # Test connection locally
   npx prisma db pull
   ```

2. **Verify Environment Variables**:
   ```bash
   # Check if DATABASE_URL is set
   node -e "console.log(process.env.DATABASE_URL ? 'SET' : 'NOT SET')"
   ```

3. **Check Supabase Dashboard**:
   - Database → Settings → Connection String
   - Verify the connection string matches your `DATABASE_URL`
   - Check if the database is paused or needs to be restarted

4. **Vercel Logs**:
   - Check Vercel deployment logs for connection errors
   - Verify environment variables are set correctly
   - Check if the deployment is using the correct environment

### Common Solutions

#### Solution 1: Restart Supabase Database
1. Go to Supabase Dashboard
2. Navigate to Settings → Database
3. If paused, click "Restore" or "Resume"
4. Wait for the database to be available
5. Retry your application

#### Solution 2: Update Connection String
1. Get the correct connection string from Supabase Dashboard
2. Update `DATABASE_URL` in Vercel environment variables
3. Use the pooler endpoint for serverless: `pooler.supabase.com:5432`
4. Redeploy your application

#### Solution 3: Enable Connection Pooling
1. Go to Supabase Dashboard → Settings → Database
2. Enable "Connection Pooling"
3. Use the pooler connection string:
   ```
   postgresql://postgres:[PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:5432/postgres?pgbouncer=true
   ```
4. Update `DATABASE_URL` in Vercel
5. Redeploy

#### Solution 4: Check SSL Configuration
If not using pgbouncer, ensure SSL is enabled:
```
postgresql://postgres:[PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:5432/postgres?sslmode=require
```

### Error Handling

The application now includes error handling that:
- Catches database connection errors gracefully
- Logs detailed error messages for debugging
- Allows the application to continue running (with limited functionality)
- Returns `null` for user data when the database is unavailable

This means your application won't crash, but user-specific features (like the dashboard) may not work until the database connection is restored.

### Getting Help

If the issue persists:
1. Check Supabase documentation: https://supabase.com/docs/guides/database/connecting-to-postgres
2. Check Vercel documentation: https://vercel.com/docs/concepts/get-started/environment-variables
3. Review Supabase logs in the dashboard
4. Check Vercel deployment logs for detailed error messages

