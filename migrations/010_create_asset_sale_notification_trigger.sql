-- Migration: Create trigger for asset sale notifications
-- Description: Automatically creates notifications when assets are sold (orders completed)

-- Function to create notification when order is completed
CREATE OR REPLACE FUNCTION notify_asset_sale()
RETURNS TRIGGER AS $$
DECLARE
    asset_record RECORD;
    contributor_id_val UUID;
BEGIN
    -- Only trigger on status change to 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Get asset information
        SELECT contributor_id, title, price_paid INTO asset_record
        FROM public.assets
        WHERE id = NEW.asset_id;

        -- If asset has a contributor, create notification
        IF asset_record.contributor_id IS NOT NULL THEN
            INSERT INTO public.notifications (
                user_id,
                type,
                title,
                message,
                link
            ) VALUES (
                asset_record.contributor_id,
                'asset_sold',
                'Asset Sold! 💰',
                'Your asset "' || asset_record.title || '" has been sold for $' || NEW.price_paid::text || '.',
                '/contributor/dashboard'
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_notify_asset_sale ON public.orders;
CREATE TRIGGER trigger_notify_asset_sale
    AFTER INSERT OR UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_asset_sale();

COMMENT ON FUNCTION notify_asset_sale() IS 'Creates notifications when assets are sold (orders completed)';

