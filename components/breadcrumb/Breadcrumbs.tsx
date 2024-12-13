import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import React from 'react';
import { PATH } from 'src/routes';

interface BreadcrumbsProps {
    model: MenuItem[];
}

function Breadcrumbs({ model }: BreadcrumbsProps) {
    const router = useRouter();

    // Helper function to generate absolute paths
    const getAbsolutePath = (url: string) => {
        // If the URL is already an absolute path, return it directly
        if (url.startsWith('/')) {
            return url;
        }
        // Otherwise, treat it as relative to PATH.connectionId
        return PATH.connectionId(url);
    };

    return (
        <div className="p-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 }}>
            <Button
                onClick={() => {
                    router.push(PATH.main); // Always navigate to the main path
                }}
                icon="pi pi-home"
            />

            {model?.map((item, index) => (
                <React.Fragment key={item.id}>
                    {/* Separator */}
                    <i className="pi pi-chevron-right" style={{ fontSize: '1.5rem' }}></i>


                    {/* Button */}
                    <Button
                        onClick={() => {
                            if (item.url) {
                                router.push(getAbsolutePath(item.url)); // Ensure absolute path navigation
                            }
                        }}
                        style={
                            index === model.length - 1
                                ? {
                                    transform: 'translateY(var(--translate-y)) translateX(var(--translate-x))',
                                    boxShadow: 'var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-color)',
                                }
                                : {}
                        }
                    >
                        <h5 style={{ margin: 0, padding: '0.2rem' }}>{item.label}</h5>
                    </Button>
                </React.Fragment>
            ))}
        </div>
    );
}

export default Breadcrumbs;
