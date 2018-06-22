<?php

namespace Wdevs\Dymo\Controller\Adminhtml\Auth;

use Magento\Customer\Model\Session;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\ResultFactory;
use Magento\Integration\Model\Oauth\TokenFactory;

class Token extends \Magento\Customer\Controller\AbstractAccount
{

    private $tokenModelFactory;

    private $authSession;

    private $authorization;


    public function __construct(
        Context $context,
        Session $customerSession,
        TokenFactory $tokenModelFactory
    ) {
        $this->tokenModelFactory = $tokenModelFactory;
        $this->authSession = $context->getAuth();
        $this->authorization = $context->getAuthorization();
        parent::__construct($context);
    }


    public function execute()
    {
        $isAllowed = $this->authorization->isAllowed('Magento_Sales::sales');
        $result = $this->resultFactory->create(ResultFactory::TYPE_JSON);

        if ($isAllowed) {
            $user = $this->authSession->getUser();
            if ($user) {
                $adminId = $user->getId();

                //create the auth token
                $adminToken = $this->tokenModelFactory->create()->createAdminToken($adminId)->getToken();
                $result->setData(['authToken' => $adminToken]);

                return $result;
            }

        }

        $result->setHttpResponseCode(\Magento\Framework\Webapi\Exception::HTTP_FORBIDDEN);

        return $result;
    }

}